var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const {stationModel} = require("../model/index")
const passport = require('passport')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;



passport.use('jwt', new JwtStrategy(opts, function(payload, done) {

    stationModel.findOne({"admin.gmail": payload.gmail}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }).select(["admin.gmail", "admin._id"]);
}));

