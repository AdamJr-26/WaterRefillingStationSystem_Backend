var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { stationModel } = require("../model/index");
const passport = require("passport");
var opts = {};
const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }

  return jwt;
};
opts.jwtFromRequest = cookieExtractor;
// ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  "jwt",
  new JwtStrategy(opts, function (payload, done) {
    stationModel
      .findOne({ "admin.gmail": payload.gmail }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .select(["admin.gmail", "admin._id"]);
  })
);
