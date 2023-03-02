const passport = require("passport");
const responseUtil = require("../utils/server.responses.util");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.clearCookie("jwt").status(401).json({
        authorized: false, message: "User unauthorized."
      })

    } else {
      // console.log('user',user)
      req.user = user;
      next()
    }
  })(req, res, next);
};

module.exports = {
  authenticate,
};

