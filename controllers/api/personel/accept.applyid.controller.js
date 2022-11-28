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
          const personel = await mutation.updatePersonelAdminId(payload);

          console.log("personel",personel)
          if (personel?.data?.admin && !personel?.error) {
            const tokenPayload = {
              gmail: personel?.data?.gmail,
              _id: personel?.data?._id,
              role: personel?.data?.role,
              admin: personel?.data?.admin,
            };

            const accessToken = await signIn.accessToken(tokenPayload);
            // renew jwt token.
            if (accessToken) {
              // if access token has successed.
              // response new jwt
              responseUtil.renewJWT(res, 200, accessToken, {
                success: true,
                userToken: accessToken,
              });
            } else {
                console.log("error personel/accept.applyid")
              // something went wrong token cannot be created.
              responseUtil.generateServerErrorCode(
                res,
                400,
                "Accepting apply ID error",
                "Something went wrong, please try again.",
                "personel_apply_adminId"
              );
            }
          }
        } else {
            console.log("error personel/accept.applyid")
          // error getting otp
          responseUtil.generateServerErrorCode(
            res,
            400,
            "Accepting apply ID error",
            "Something went wrong, please try again.",
            "personel_apply_adminId"
          );
        }
      } else {
        console.log("error personel/accept.applyid")
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
