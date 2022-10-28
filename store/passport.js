const { Strategy, ExtractJwt } = require("passport-jwt");
const { config, underscoreId } = require("../config/jwt.config");

const { stationModel } = require("../model/index");

const applyPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.secretKey;
  passport.use(
    new Strategy(options, (payload, done) => {
      console.log("payload", payload);
      stationModel.findOne({ "admin.gmail": payload.gmail }, (err, user) => {
        console.log("uesrrrrrrrrrrrrrrrrrrr", user);
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            gmail: user.admin.gmail,
            _id: user.admin[underscoreId],
          });
        }
        return done(null, false);
      });
    })
  );
};
module.exports = {
  applyPassportStrategy,
};
