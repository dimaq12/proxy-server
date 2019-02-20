
const passport = require('passport');
const BasicStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; 
const { ExtractJwt } = require('passport-jwt'); 
const ms  = require('ms');
const { signSync }  = require('../jwt'); 
const config  = require('../config');


const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies['access_token'];
  }
  return token;
};

exports.password = () => (req, res, next) =>
  passport.authenticate('password', { session: false, successRedirect: '/' }, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      return res.status(401).redirect('/login')
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
})(req, res, next)

exports.token = () => (req, res, next) => 
  passport.authenticate('token', { session: false, failureRedirect: '/login' }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).redirect('/login')
    }
    
    let clockTimestamp = Math.round(new Date().getTime()/1000);
    const secondsBeforeExpiration = Math.round(ms(config.timeBeforeExpiration)/1000);

    if(user.exp < (clockTimestamp + secondsBeforeExpiration)){
      const token = signSync(user.username, {expiresIn: config.expirationTime});
      res.cookie('access_token', token)
    } 
    
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).redirect('/login')
      next()
    })
})(req, res, next)

passport.use('password', new BasicStrategy((username, password, done) => {
    const { masterUsername, masterPassword } = config;
    if(masterUsername !== username || masterPassword !== password){
        done(true);
        return null;
    }

    done(null, { username })
    return null
}))

passport.use('token', new JwtStrategy({
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        ExtractJwt.fromExtractors([cookieExtractor])
    ])
}, ( { user, exp }, done) => {
    const { masterUsername } = config;
    if(masterUsername !== user){
        done(true);
        return null;
    }
    done(null, {username: user, exp});
    return null;
}))

exports.passport = passport;