const db = require("../db/conn")

const station_schema = require("./documents/stations.schema")

const stationModel = db.model("Station", station_schema)


module.exports = {
    stationModel
}