
const {stationModel} = require("../../model/index")

module.exports = {
    ...require("./auth.register.mutation")(stationModel),
    ...require("./auth.verify.mutation")(stationModel)
}
