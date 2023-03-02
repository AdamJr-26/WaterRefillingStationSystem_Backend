module.exports = () => {
  return {
    logoutAdmin: (req, res) => {
      
      if (req.cookies["jwt"]) {
        
        res
          .clearCookie("jwt")
          .status(200)
          .json({ messsage: "you are just logged out" });
      } else {
        res.status(400).json({ error: "invalid" });
      }
    },
    logoutPersonel: (req, res) => {
      
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
