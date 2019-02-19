
const passport = require('passport');
const BasicStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; 
const { ExtractJwt } = require('passport-jwt'); 
const { verify }  = require('../jwt'); 
const config  = require('../config');

const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies['access_token'];
  }
  return token;
};

exports.refresh = () => {
  return (req, res, next) => {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['access_token'];
    }
    const payload = verify(token);
    console.log(payload);
    next()
  }
}

// exports.refresh = function(req, res, next) {
//   var token = null;
//   if (req && req.cookies)
//   {
//       token = req.cookies['access_token'];
//   }
//   const payload = verify(token);
//   console.log(payload);
//   next()
// }


// exports.refresh = function(token, refreshOptions) {
  
//   // delete payload.iat;
//   // delete payload.exp;
//   // delete payload.nbf;
//   // delete payload.jti; //We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
//   // const jwtSignOptions = Object.assign({ }, this.options, { jwtid: refreshOptions.jwtid });
//   // // The first signing converted all needed options into claims, they are already in the payload
//   // return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
// }


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
  console.log(exp)
    const { masterUsername } = config;
    if(masterUsername !== user){
        done(true);
        return null;
    }
    done(null, {username: user});
    return null;
}))

exports.passport = passport;