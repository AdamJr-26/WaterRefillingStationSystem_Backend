const router = require("express").Router();

const authController = require("../controllers/auth/index");
const apiController = require("../controllers/api/index");
const validationUtil = require("../utils/validation.util")
const passport = require('passport');

router.post(
  "/register/station",
  apiController.checkAdminEmail,
  authController.registerAdmin,
  validationUtil.registerValidation
);





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
