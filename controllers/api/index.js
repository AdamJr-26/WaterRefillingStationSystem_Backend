const query = require("../../data-access/query/index");
const mutation = require("../../data-access/mutation/index");
const transaction = require("../../data-access/transaction/index");
const responseUtil = require("../../utils/server.responses.util");
const {
  uploadImage,
  deleteFiles,
} = require("../../utils/file.cloud.uploader.util");
const crypto = require("crypto");
const signIn = require("../../utils/jwt.sign");
const getAdminId = require("../../utils/getAdminId");

module.exports = {
  ...require("../auth/checking.gmail")(query),
  ...require("./personel/api.profile")(
    query,
    mutation,
    responseUtil,
    uploadImage,
    deleteFiles
  ),
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
  ...require("./admin/personnels.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
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
  ...require("./general/create.customer.controller")(
    query,
    mutation,
    responseUtil,
    uploadImage,
    getAdminId,
    transaction
  ),
  ...require("./general/get.gallons.available.controller")(
    query,
    getAdminId,
    responseUtil
  ),
  ...require("./personel/get.admin.basic.profile")(query, responseUtil),
  ...require("./general/get.customer.controller")(
    query,
    responseUtil,
    getAdminId
  ),
  ...require("./general/schedule.controller")(
    query,
    mutation,
    responseUtil,
    getAdminId
  ),
  ...require("./general/discount.controller")(
    query,
    mutation,
    responseUtil,
    getAdminId
  ),
  ...require("./general/deliver.order.controller")(
    query,
    mutation,
    transaction,
    getAdminId,
    responseUtil
  ),
  ...require("./general/credits.controller")(
    query,
    mutation,
    transaction,
    getAdminId,
    responseUtil
  ),
  ...require("./general/borrow.controller")(
    query,
    mutation,
    transaction,
    getAdminId,
    responseUtil
  ),
  ...require("./general/delivery.controller")(
    query,
    mutation,
    transaction,
    getAdminId,
    responseUtil
  ),
  ...require("./personel/schedule.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),

  ...require("./general/customer.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
  ...require("./general/purchase.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
  ...require("./general/credits.receipts.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
  ...require("./general/expenses.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),

  // reports
  ...require("./admin/reports.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
  ...require("./general/return.controller")(
    query,
    mutation,
    getAdminId,
    responseUtil
  ),
};
