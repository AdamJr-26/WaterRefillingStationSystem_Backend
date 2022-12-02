const router = require("express").Router();
// const passport = require("passport");
//passport.authenticate('jwt', {session: false})
const authController = require("../../controllers/auth");
const {
  authenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get("/authorize-me", authenticate, authController.authorizeAdmin); // no use

module.exports = { router };
