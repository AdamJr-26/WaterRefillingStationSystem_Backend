module.exports = () => {
  return {
    logoutAdmin: (req, res) => {
      console.log("req.cookeis", req.cookies);
      if (req.cookies["jwt"]) {
        console.log("yes this is jwt cookie and I removing it");
        res
          .clearCookie("jwt")
          .status(200)
          .json({ messsage: "you are just logged out" });
      } else {
        res.status(400).json({ error: "invalid" });
      }
    },
    logoutPersonel: (req, res) => {
      console.log(req.cookies);
      if (req.cookies["jwt"]) {
        res
          .clearCookie("jwt")
          .status(200)
          .json({ message: "you are just logged out" });
      } else {
        res.status(400).json({ error: "invalid" });
      }
    },
  };
};
