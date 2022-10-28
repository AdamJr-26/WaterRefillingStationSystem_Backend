const passport = require("passport");
const responseUtil = require("../utils/server.responses.util");

const authenticate = (req, res, next) => {
   passport.authenticate("jwt", { session: false }, (error, user, info) => {
      if (error) {
        responseUtil.generateServerErrorCode(
          res,
          401,
          error,
          "UNAUTHORIZED_USER",
          "authorization"
        );
      } else {
        next();
      }
    });

};
module.exports = {
  authenticate,
};
