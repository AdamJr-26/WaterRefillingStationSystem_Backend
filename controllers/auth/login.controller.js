const { stationModel } = require("../../model");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");
module.exports = (
  mutation,
  query,
  sendEmail,
  clientCofing,
  responseUtil,
  constantUtils,
  validationResult,
  comparePassword
) => {
  return {
    loginAdmin: async (req, res) => {
      const { gmail, password } = req.body;
      if (!gmail || !password) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          "email and Password are required",
          "Please check the email and password input.",
          "login-admin"
        );
      }
      const isAdminExist = await query.isAdminExist({ gmail, password });

      // if error when finding admin
      if (isAdminExist?.error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          isAdminExist?.error,
          "SOMETHING WENT WRONG",
          "login-admin"
        );
      }
      // if admin did not exists
      else if (!isAdminExist?.data) {
        responseUtil.generateServerErrorCode(
          res,
          401,
          "Cannot find User",
          "Accoutn can't found",
          "login-admin"
        );
      }
      // else no error or admin exists.
      else {
        const isPasswordMatched = await comparePassword(
          password,
          isAdminExist.data?.admin?.password
        );
        if (isPasswordMatched) {
          // create jwt here
          responseUtil.generateServerResponse(
            res,
            201,
            "Login Granted",
            "You have successfully logged in.",
            "data is confidential",
            "login-admin"
          );
        } else {
          responseUtil.generateServerErrorCode(
            res,
            401,
            "Unauthorized accessed",
            "Wrong Password",
            "login-admin"
          );
        }
      }
    },
  };
};

//   loginAdmin: async(req, res)=>{
//     const errorsAfterValidation = validationResult(req);
//     if(!errorsAfterValidation.isEmpty()){
//         return res.status(400).json({
//             code: 400,
//             errors: errorsAfterValidation.mapped()
//         });
//     }
//     try{
//         // from here I can seperate this as other module
//         const { gmail, password } = req.body;
//         const admin = await stationModel.findOne({"admin.gmail": gmail}).select(["admin"]).exec();
//         console.log("admin", admin)
//         if(admin && admin.admin.gmail){
//             const isPasswordMatched = await comparePassword(password, admin.admin.password)
//             if(isPasswordMatched){
//                 const token = jwt.sign({gmail},jwtConfig.config.secretKey, {expiresIn: 10000000} )
//                 const userToReturn = { ...admin.admin?.toJSON(), ...{ token } };
//                 delete userToReturn.password;
//                 res.status(200).json(userToReturn);
//             }else{
//                 responseUtil.generateServerErrorCode(res, 403, 'login password error', "WRONG_PASSWORD", 'password' )
//             }
//         }
//         else{
//             responseUtil.generateServerErrorCode(res, 200, "error", "Admin not existed")
//         }
//     }catch(err){
//         responseUtil.generateServerErrorCode(res, 404, err, "SOMETHING WENT WRONG")
//     }
// }
