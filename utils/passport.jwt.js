var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { Admin, Personel } = require("../model/index");
const passport = require("passport");
const roles = require("../config/authorize.roles.config");

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
    const role = payload?.role;
    const roleModal = (roles, r) => {
      const foundRole = (r) => roles.find((role) => role === r);
      if (foundRole(r) === "Admin") {
        return Admin;
      } else if (foundRole(r) === "Personel") {
        return Personel;
      }else{
        return false
      }
    };
    if (roleModal(roles, role)) {
      roleModal(roles, role)
        ?.findOne({ gmail: payload.gmail }, function (err, user) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .select(["gmail", "_id"]);
    }else{
      done(null, false) // no role found.
    }
  })
);
