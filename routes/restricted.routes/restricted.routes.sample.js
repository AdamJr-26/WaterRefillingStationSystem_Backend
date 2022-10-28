// sample restricted route
const router = require("express").Router();
const passport = require("passport");
router.get(
  "/restricted",
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);


module.exports = {
  router,
};
