module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    sellContainer: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const fields = req.body;
        console.log("fieldsfieldsfields", fields);
        const data = await mutation.sellContainer({ fields, admin });

        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "The transaction was successfully processed and the container was sold.",
          data,
          "sell_containers"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "sell_containers"
        );
      }
    },
    getSoldContainers: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const { page, limit, date } = req.params;
        const data = await query.getSoldContainers({
          admin,
          page,
          limit,
          date,
        });
        responseUtil.generateServerResponse(
          res,
          200,
          "success",
          "get sold containers",
          data,
          "get_sold_containers"
        );
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "get_sold_containers"
        );
      }
    },
  };
};
