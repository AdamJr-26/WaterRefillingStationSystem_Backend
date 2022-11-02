const router = require("express").Router();
const passport = require("passport");
//passport.authenticate('jwt', {session: false})
const {authenticate} = require("../middlewares/passport.authenticate.middleware")
router.get("/authorize-me",authenticate)


module.exports = { router };