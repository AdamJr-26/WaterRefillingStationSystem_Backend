module.exports = (query, mutation, getAdminId, responseUtil) => {
  return {
    getPayersCredits: async (req, res) => {
      const admin = getAdminId(req);
      const { limit, skip, from, to } = req.params;

      const { data, error } = await query.getPayersCredits({
        admin,
        limit,
        skip,
        from,
        to,
      });
      console.log("from, to", from, to);
      if (data && !error) {
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get all customers history from paying debt",
          data,
          "get_credits_payers_history"
        );
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Error",
          "Oops something went wrong, please try again",
          "get_credits_payers_history"
        );
      }
    },
  };
};
