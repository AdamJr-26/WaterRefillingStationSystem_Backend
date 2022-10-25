
const {stationModel} = require("../../model/index")
module.exports ={
    ...require("./station")(stationModel),
    ...require("./check.gmail")(stationModel)
}