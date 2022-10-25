const mongoose = require("mongoose")

module.exports = new mongoose.Schema({
    gmail: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    contact_number:{type: String},
    complete_address: {type: String},
    position: {type: String},
    password: {type: String},
    station_id: {type: String},
})
