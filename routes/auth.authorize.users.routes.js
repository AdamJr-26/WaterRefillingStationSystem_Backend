const router = require("express").Router();
// const passport = require("passport");
//passport.authenticate('jwt', {session: false})

const {authenticateAdmin} = require("../middlewares/passport.authenticate.admin.middleware")
router.get("/authorize-me", authenticateAdmin);

module.exports = { router };
