// sample restricted route
const router = require("express").Router();
const passport = require("passport");
router.get(
  "/restricted",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);
router.get("/logout", (req, res) => {
  if (req.cookies["jwt"]) {
    console.log("yes jwt ");
    res
      .clearCookie("jwt")
      .status(200)
      .json({ messsage: "you have logged out" });
  } else {
    res.status(400).json({ error: "invalid" });
  }
});

module.exports = {
  router,
};

