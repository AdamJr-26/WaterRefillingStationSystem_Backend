const query = require("../../data-access/query/index");
const responseUtil = require("../../utils/server.responses.util");
module.exports = {
    ...require("../auth/checking.gmail")(query),
    ...require("./personel/api.profile")(query,responseUtil),
}