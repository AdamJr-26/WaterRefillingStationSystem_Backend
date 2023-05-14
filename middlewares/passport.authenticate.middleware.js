const passport = require("passport");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    console.log("user", user)
    if (err || !user) {
      return res.clearCookie("jwt").status(401).json({
        authorized: false,
        message: "User unauthorized.",
      });
    } else {
      // console.log('user',user)
      req.user = user;
      next();
    }
  })(req, res, next);
};

// ginamit ko lang to para mailagay yung user info sa request.
const googleSignInAuthenticate = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      // wala na tong clear cookie.
      return res.clearCookie("jwt").status(401).json({
        authorized: false,
        message: "User unauthorized.",
      });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

module.exports = {
  authenticate,
  googleSignInAuthenticate,
};
