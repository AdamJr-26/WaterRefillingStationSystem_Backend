module.exports = (query, mutation, responseUtil, getAdminId) => {
  return {
    updateControls: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const fields = req.body;
        console.log("fields", fields);
        const docs = await mutation.updateControls({
          fields: fields,
          admin: admin,
        });
        const data = await query.getControls({ admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "Updated controls",
          "success",
          data,
          "controls"
        );
      } catch (error) {
        console.log("errr", error);
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "controls"
        );
      }
    },
    getControls: async (req, res) => {
      try {
        const admin = getAdminId(req);
        const data = await query.getControls({ admin });
        responseUtil.generateServerResponse(
          res,
          200,
          "fetch controls",
          "success",
          data,
          "controls"
        );
        console.log("dataa", data);
      } catch (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error.name,
          error.message,
          "controls"
        );
      }
    },
  };
};
