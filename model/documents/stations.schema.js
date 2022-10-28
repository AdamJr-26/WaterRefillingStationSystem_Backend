const mongoose = require("mongoose");
const admin_account_schema = require("../sub.documents/admin.account.schema")
const delivery_personel = require("../sub.documents/deliverypersonel")
const passportLocalMongoose = require('passport-local-mongoose');


const stationsSchema= new mongoose.Schema({
  name: {type:String},
  station_id: {type: String},
  admin: admin_account_schema,
  delivery_personels : [delivery_personel]
});

// stationsSchema.plugin(passportLocalMongoose)

module.exports = stationsSchema ;
