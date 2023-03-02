module.exports = (
  mutation,
  query,
  comparePassword,
  encryptPassword,
  responseUtil
) => {
  return {
    updateAdminPassword: async (req, res) => {
      const { current_password, new_password, gmail } = req.body;
      //   if not null passwords
      // if admin exists
      // compare current password
      // if match encrypt new_password
      // update the database with new password.
      if (!current_password || !new_password) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "Current or new password should not be empty",
          "Please check the current and new password input.",
          "update_password_admin"
        );
      }
      const { data, error } = await query.isAdminExistAndVerified({
        gmail,
        current_password,
      });
      if (error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          isAdminExist?.error,
          "SOMETHING WENT WRONG",
          "update_password_admin"
        );
      } else if (!data && !error) {
        responseUtil.generateServerErrorCode(
          res,
          409,
          "Cannot find User",
          "Account can't find",
          "update_password_admin"
        );
      }
      //   if admin is exists and no error
      else if (data && !error) {
        
        const isPasswordMatched = await comparePassword(
          current_password,
          data?.password
        );
        if (isPasswordMatched) {
          
          // hash password
          const hashed_password = await encryptPassword(new_password, 10);

          const { data, error } = await mutation.updateAdminPassword({
            gmail,
            hashed_password,
          });
          if (data && !error) {
            responseUtil.generateServerResponse(
              res,
              201,
              "Password Updated",
              "You have updated your pasword.",
              "no data to show",
              "update_password_admin"
            );
          } else {
            responseUtil.generateServerErrorCode(
              res,
              400,
              "error",
              "Something went wrong while verifying your account.",
              "update_password_admin"
            );
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            401,
            "Wrong Password",
            "Wrong current password",
            "update_password_admin"
          );
        }
      }
    },
  };
};
