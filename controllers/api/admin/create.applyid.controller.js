module.exports = (query, mutation, crypto, responseUtil) => {
  return {
    createApplyID: async (req, res) => {
      const adminId = req.user?._id;
      const gmail = req.body?.gmail;
      if (gmail && adminId) {
        const token = crypto.randomBytes(4).toString("hex");
        const { otp, error } = await mutation.createApplyID({
          adminId,
          gmail,
          token,
        });
        // check if gmail is existing.
        const { personelData, personel_error } =
          await query.checkIfPersonelExistingAndVerified({ gmail });
        if (personelData && !personel_error) {
          if (otp && !error) {
            responseUtil.generateServerResponse(
              res,
              201,
              "Apply Delivery Personel",
              "Apply new delivery personel success",
              { success: true, otp },
              "apply_new_personel_admin"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              error,
              "SOMETHING WENT WRONG",
              "apply_new_personel_admin"
            );
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            400,
            error,
            "User doesn't exists.",
            "apply_new_personel_admin"
          );
        }
      } else {
        responseUtil.generateServerErrorCode(
          res,
          400,
          error,
          "SOMETHING WENT WRONG",
          "apply_new_personel_admin"
        );
      }
    },
  };
};
