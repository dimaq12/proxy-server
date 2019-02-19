
const passport = require('passport');
const { BasicStrategy } = require('passport-http'); 
const { Strategy, ExtractJwt } = require('passport-jwt');  
const { jwtSecret } = require('../config');

exports.password = () => (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)

  exports.token = () => (req, res, next) => 
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)

passport.use('password', new BasicStrategy((username, password, done) => {
    const {masterUsername, masterPasword} = config;

    if(masterUsername !== username || masterPasword !== password){
        done(true);
        return null;
    }

    done(null, { username })
    return null
}))

passport.use('token', new Strategy({
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    ])
}, ( { user }, done) => {
    if(masterUsername !== username){
        done(true);
        return null;
    }
    done(null, user)
}))