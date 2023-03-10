const router = require("express").Router();
const passport = require("passport");
const authController = require("../../controllers/auth");
const {
  googleSignInAuthenticate,
} = require("../../middlewares/passport.authenticate.middleware");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// handle google callback
router.get(
  "/google/redirect",
  googleSignInAuthenticate,
  authController.signInWithGoogle
);

module.exports = { router };
