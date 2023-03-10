module.exports = (query, responseUtil, comparePassword, signIn) => {
  return {
    signInWithGoogle: async (req, res) => {
      const user = req.user;
      const payload = {
        gmail: user.gmail,
        _id: user._id,
        role: user.role,
      };
      const accessToken = await signIn.accessToken(payload);
      if (accessToken) {
        //sample
        // responseUtil.generateServerResponse(
        //   res,
        //   200,
        //   "Signin",
        //   "Sign in Successfully",
        //   {
        //     token: `Bearer ${accessToken}`,
        //     user,
        //   }
        // );
        res.redirect(
          `${process.env.ORDERING_FRONTEND_URL}?id=${accessToken}`
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          401,
          "Unauthorized accessed",
          "Wrong Password",
          "signin"
        );
      }
    },
  };
};
