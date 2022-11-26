const query = require("../../data-access/query/index");
const mutation  = require("../../data-access/mutation/index")
const responseUtil = require("../../utils/server.responses.util");
const {uploadImage} = require("../../utils/file.cloud.uploader.util");
const crypto = require("crypto");

module.exports = {
    ...require("../auth/checking.gmail")(query),
    ...require("./personel/api.profile")(query,responseUtil),
    ...require("./admin/inventory.controller")(query, mutation,responseUtil,uploadImage),
    ...require("./Employee/employee.controller")(query,mutation, crypto, responseUtil),
}