const query = require("../../data-access/query/index");
const mutation = require("../../data-access/mutation/index");
const transaction = require("../../data-access/transaction/index");
const responseUtil = require("../../utils/server.responses.util");
const { uploadImage } = require("../../utils/file.cloud.uploader.util");
const crypto = require("crypto");
const signIn = require("../../utils/jwt.sign");
const getAdminId = require("../../utils/getAdminId");

module.exports = {
  ...require("../auth/checking.gmail")(query),
  ...require("./personel/api.profile")(query, responseUtil),
  ...require("./admin/inventory.controller")(
    query,
    mutation,
    responseUtil,
    uploadImage,
    getAdminId
  ),
  ...require("./admin/create.applyid.controller")(
    query,
    mutation,
    crypto,
    responseUtil
  ),
  ...require("./personel/accept.applyid.controller")(
    query,
    mutation,
    responseUtil,
    signIn
  ),
  ...require("./admin/personels.controller")(query, responseUtil),
  ...require("./admin/admin.profile.controller")(query, responseUtil),
  ...require("./personel/delivery.controller")(
    query,
    mutation,
    responseUtil,
    getAdminId
  ),
  ...require("./admin/delivery.controller")(
    query,
    mutation,
    transaction,
    responseUtil,
    getAdminId
  ),
};
