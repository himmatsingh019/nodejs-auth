const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()

var User = require('../models/user')


module.exports = function (passport) {
    var opts = {}

    opts.secretOrKey = process.env.SECRET
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.find({
            id: jwt_payload.id

        }, function (err, user) {
            if (err) {
                return done(err, user)
            }
            if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))
}
