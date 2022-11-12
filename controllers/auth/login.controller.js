
module.exports = (
  mutation,
  query,
  sendEmail,
  clientCofing,
  responseUtil,
  constantUtils,
  validationResult,
  comparePassword,
  signIn
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
      const isAdminExist = await query.isAdminExistAndVerified({ gmail, password });
      console.log("isAdminExist",isAdminExist)
      // if error when finding admin
      if (isAdminExist?.error) {
        responseUtil.generateServerErrorCode(
          res,
          400,
          isAdminExist?.error,
          "SOMETHING WENT WRONG",
          "login_admin"
        );
      }
      // if admin did not exists
      else if (!isAdminExist?.data) {
        responseUtil.generateServerErrorCode(
          res,
          409,
          "Cannot find User",
          "Account can't find",
          "login_admin"
        );
      }
      // else no error or admin exists.
      else {
        const isPasswordMatched = await comparePassword(
          password,
          isAdminExist.data?.admin?.password
        );

        if (isPasswordMatched) {
          // if true, then user is granted.
          // create jwt here

          // get token and get back to the user
          const payload = {
            gmail: isAdminExist.data?.admin?.gmail,
            _id: isAdminExist.data?.admin?._id,
          };
          // generate refresh token.

          const accessToken = await signIn.accessToken(payload);
          if (accessToken) {
            // `Bearer ${accessToken}`
            res.cookie("jwt", accessToken, {
              httpOnly: true,
              secure: false, // set to true on product.
            }).status(200).json({success: true,user: {
              gmail:isAdminExist.data?.admin?.gmail,
              firstname: isAdminExist.data?.admin?.firstname,
              lastname: isAdminExist.data?.admin?.lastname,
              imageUrl: isAdminExist.data?.admin?.imageUrl,
            }})
          }
        } else {
          responseUtil.generateServerErrorCode(
            res,
            401,
            "Unauthorized accessed",
            "Wrong Password",
            "login_admin"
          );
        }
      }
    },
    loginPersonel:async(req, res)=>{
      const {gmail, password} = req.body;
      console.log(req.body)
      const {personelData,personel_error } =await checkIfPersonelExistingAndVerified({gmail})
      // check if the user is existing and verified.
      // hashd the password compare password from db password.
      // if matched send cookie.
      if(personelData?.gmail && personelData?.verified && !personel_error ){
        const isPasswordMatched = await comparePassword(
          password,
          personelData.password
        );
        if(isPasswordMatched){
          const payload = {
            gmail:personelData?.gmail, 
            _id: "",
          }
          const accessToken = await signIn.accessToken(payload);
          if(accessToken){
            // sent to user the cookie
          }else{
            // someting went wrong
          }
        }else{
          // password did not matched
        }
      }else{
        // user do not exists, or error
      }
    }
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
