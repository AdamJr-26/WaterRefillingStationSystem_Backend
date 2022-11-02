const passport = require("passport");
const responseUtil = require("../utils/server.responses.util");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return responseUtil.generateServerResponse(
        res,
        200,
        "authorization of request",
        "mesage from register admin",
        { authorized: false,...user, ...err },
        "authorize-admin"
      );
    } else {
      next()
    }
  })(req, res, next);
};

module.exports = {
  authenticate,
};

/* POST login. */
// function hello(req, res, next) {
//   passport.authenticate("local", { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: "Something is not right",
//         user: user,
//       });
//     }
//     req.login(user, { session: false }, (err) => {
//       if (err) {
//         res.send(err);
//       }
//       // generate a signed son web token with the contents of user object and return it in the response
//       const token = jwt.sign(user, "your_jwt_secret");
//       return res.json({ user, token });
//     });
//   })(req, res);
// }
