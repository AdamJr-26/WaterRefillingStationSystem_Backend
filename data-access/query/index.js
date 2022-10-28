
const {stationModel} = require("../../model/index")
module.exports ={
    ...require("./station.collection.query")(stationModel)
}


// checkAdminEmail: async (req, res, next) => {
//     const { gmail } = req.body;
//     const email = await query.getAdminGmailIfExisting(gmail);
//     // if err send response 409
//     // if email true send response 200
//     // if both null next()
//     if (email?.err) {
//       responseUtil.generateServerErrorCode(
//         res,
//         400,
//         err,
//         "Something went wrong.",
//         "register"
//       );
//     } else if (email?.email) {
//       responseUtil.generateServerResponse(
//         res,
//         201,
//         "Login Granted",
//         "You have successfully logged in.",
//         "data is confidential",
//         "login-admin"
//       );
//     } else {
//       next();
//     }
//   },