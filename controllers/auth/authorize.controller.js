module.exports = (responseUtil) => {
  return {
    authorizeAdmin: async (req, res) => {
      responseUtil.generateServerResponse(
        res,
        200,
        "authorized",
        "AUTHORIZED ADMIN",
        "authorize_admin"
      );
    },
  };
};
