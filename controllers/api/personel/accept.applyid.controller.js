module.exports = (query, mutation, responseUtil, signIn) => {
  return {
    personelAcceptApplyId: async (req, res) => {
      const user = req?.user;
      const applyId = req.body?.applyId;
      if (user?.gmail && applyId) {
        const otp = await query.getEmailAndToken({
          gmail: user?.gmail,
          token: applyId,
        });
        
        if (otp?.getEmailAndTokenData && !otp?.getEmailAndTokenError) {
          const payload = {
            gmail: otp?.getEmailAndTokenData?.gmail,
            adminId: otp?.getEmailAndTokenData?.userId?.toString(), // this is admin id
          };
          const { data, error } = await mutation.updatePersonelAdminId(payload);
          
          if (data && !error) {
            responseUtil.generateServerResponse(
              res,
              201,
              "success",
              "Apply as delivery personel",
              data,
              "personel_apply_adminId"
            );
          } else {
            
            // something went wrong token cannot be created.
            responseUtil.generateServerErrorCode(
              res,
              400,
              "Accepting apply ID error",
              "Something went wrong, please try again.",
              "personel_apply_adminId"
            );
          }
        }else{
          responseUtil.generateServerErrorCode(
            res,
            409,
            "Accepting apply ID error",
            "Sorry we cannot find that apply ID",
            "personel_apply_adminId"
          );
        }
      } else {
        // all field are required.
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Accepting apply ID error",
          "Something went wrong, please try again.",
          "personel_apply_adminId"
        );
      }
    },
  };
};
