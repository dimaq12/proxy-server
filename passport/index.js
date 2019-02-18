
import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

passport.use('password', new BasicStrategy((email, password, done) => {

    const userSchema = new Schema({
        email: schema.tree.email,
        password: schema.tree.password
    })

    userSchema.validate({
        email,
        password
    }, (err) => {
        if (err) done(err)
    })

    User.findOne({
        email
    }).then((user) => {
        if (!user) {
            done(true)
            return null
        }
        return user.authenticate(password, user.password).then((user) => {
            done(null, user)
            return null
        }).catch(done)
    })
}))


passport.use('token', new JwtStrategy({
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    ])
}, ({
    id
}, done) => {
    User.findById(id).then((user) => {
        done(null, user)
        return null
    }).catch(done)
}))