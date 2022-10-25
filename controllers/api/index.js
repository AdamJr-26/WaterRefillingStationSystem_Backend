const query = require("../../data-access/query/index");

module.exports = {
    ...require("../auth/checking.gmail")(query)
}