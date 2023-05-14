var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Admin, Personel, Customer } = require("../model/index");
const passport = require("passport");
const roles = require("../config/authorize.roles.config");

var opts = {};
const cookieExtractor = (req) => {
  let jwt = null;
  if (req && req?.headers?.authorization) {
    jwt = req?.headers?.authorization.split(" ")[1];
    return jwt;
  } 
  // if (req && req.cookies) {
  //   jwt = req.cookies["jwt"];
  // }
};
opts.jwtFromRequest = cookieExtractor;
// ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  "jwt",
  new JwtStrategy(opts, function (payload, done) {
    const role = payload?.role;
    const roleModel = (roles, r) => {
      const foundRole = (r) => roles.find((role) => role === r);
      if (foundRole(r) === "Admin") {
        return Admin;
      } else if (foundRole(r) === "Personnel") {
        return Personel;
      } else {
         // else custoemr
        return Customer;
       
      }
    };

    if (roleModel(roles, role)) {
      roleModel(roles, role)
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
        .select(["gmail", "_id", "admin", "role"]);
    } else {
      console.log("no role found");
      done(null, false); // no role found.
    }
  })
);

// Google authentication
// add Google OAuth2.0 credentials
const google_strategy_ops = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/redirect",
};

passport.use(
  new GoogleStrategy(
    google_strategy_ops,
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in  database
      Customer.findOne({ gmail: profile.emails[0].value }).then(
        async (currentUser) => {
          if (currentUser) {
            // user already exists
            const user = {
              gmail: currentUser.gmail,
              _id: currentUser._id.toString(),
              admin: currentUser.admin,
              role: "Customer",
            };
            console.log("currentUser", currentUser);
            return done(null, currentUser);
          } else {
            const payload = {
              gmail: profile.emails[0].value,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              display_photo: profile.photos[0].value,
            };
            try {
              const user = new Customer(payload);
              await user.save();
              await user.updateOne({ role: "Customer" });
              console.log("user", user);
              return done(null, user);
            } catch (error) {
              console.log("errorerror", error);
              return done(null, false);
            }
          }
        }
      );
    }
  )
);
