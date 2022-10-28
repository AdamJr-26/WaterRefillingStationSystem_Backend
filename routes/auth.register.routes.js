const router = require("express").Router();

const authController = require("../controllers/auth/index");
const apiController = require("../controllers/api/index");
const responseUtil = require("../utils/server.respones.util");
const passport = require('passport');

router.post(
  "/register/station",
  apiController.checkAdminEmail,
  authController.registerAdmin,
  responseUtil.registerValidation
);

// router.get("/text-verify", authenticate.verifyUser, (req, res)=>{
//   res.status(200).send("user is verified", req.user)
// })
// router.post('/login', passport.authenticate('local'), (req, res)=>{
//   var token = authenticate.getToken({_id: req.user._id});
//   res.status(200).send({logged_in: true, token, satus:"loggin in successfull"})
// })
router.post("/login", responseUtil.loginValidation, authController.loginAdmin);

router.get("/verify-admin", authController.verifyAdmin);

// sample restricted route
router.get("/restricted",passport.authenticate('jwt', {session: false}), (req, res)=>{
  console.log(req.body)
  res.status(200).send('yes I am authorized')
} )

module.exports = { router };


// const router = require("express").Router();
// const db_query = require("../data-access/query/index");

// const stationModel = require("../model/index").stationModel;
// router.post("/register/station", async(req, res) => {
//   const {wrs_name} =req.body;
//   const data =req.body;
//   console.log(data)
//   try{
//     const newStation = new stationModel({  station_id: req.body.station_id,admin: req.body})
//     await newStation.save(err=>{
//       if(err){
//         console.log(err)
//       }
//     })
//     if(newStation){
//       console.log('success',newStation)
//       res.status(200).send(newStation)
//     }
//   }catch(err){
//     console.log(err)
//   }
// });
// router.post("/register/delivery-personel",async(req,res)=>{
//   try{
//     const doc = await stationModel.findOne({station_id: "123"});
//     doc.delivery_personels.push(req.body)
//     await doc.save()
//     console.log(doc)
//   }catch(err){
//     console.log("error", err)
//   }
// })
// module.exports = { router };
