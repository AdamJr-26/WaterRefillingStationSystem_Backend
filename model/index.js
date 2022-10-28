const db = require("../db/conn")

const station_schema = require("./documents/stations.schema");
const users_token = require("./documents/users.token");

const stationModel = db.model("Station", station_schema)
const userToken = db.model("UserToken", users_token)

module.exports = {
    stationModel,
    userToken,
}