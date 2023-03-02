module.exports = (query) => {
  return {
    checkAdminEmail: async (req, res, next) => {
      const { gmail } = req.body;
      const email = await query.getAdminGmailIfExisting(gmail);

      // if err send response 409
      // if email true send response 200
      // if both null next()
      if (email?.error) {
        res.status(400).send({
          emailExists: false,
          message: "Something went wrong",
        });
      } else if (email?.email) {
        
        res.status(200).send({
          emailExists: true,
          message: "the email is already in use",
          email,
        });
      } else {
        next();
      }
    },
  };
};
