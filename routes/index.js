const router = require("express").Router();

// auth
router.use("/auth", require("./auth/auth.register.routes").router);
router.use("/auth", require("./auth/auth.login.logout.routes").router);
router.use("/auth", require("./auth/auth.verify.routes").router);
router.use("/auth", require("./auth/auth.authorize.users.routes").router);
router.use("/auth", require("./auth/auth.update.users.routes").router);
router.use("/auth", require("./auth/auth.google.routes").router);

router.use("/api", require("./api/api.profile.users.routes").router);
router.use("/api", require("./auth/auth.account.routes").router);
router.use(
  "/api",
  require("./restricted.routes/restricted.routes.sample").router
);

// inventory
router.use("/api", require("./api/api.inventory.routes").router);

// employee
router.use("/api", require("./api/api.employee.routes").router);

// personnel
router.use("/api", require("./api/api.personnel.routes").router);

// delivery
router.use("/api", require("./api/api.delivery.routes").router);

// customer
router.use("/api", require("./api/api.customer.routes").router);

// admin
router.use("/api", require("./api/api.admin.routes").router);

// schedule
router.use("/api", require("./api/api.schedule.routes").router);

// discount
router.use("/api", require("./api/api.discounts.routes").router);

// transactions
router.use("/api", require("./api/api.transactions.routes").router);

// credits
router.use("/api", require("./api/api.credits.routes").router);

// borrow
router.use("/api", require("./api/api.borrow.routes").router);

//purchase
router.use("/api", require("./api/api.purchase.routes").router);

router.use("/api", require("./api/api.credits.receipt.routes").router);

// expenses
router.use("/api", require("./api/api.expense.routes").router);

// reports
router.use("/api", require("./api/api.reports.routes").router);

// return receipts
router.use("/api", require("./api/api.return.receipt.routes").router);

// sms
router.use("/api", require("./api/api.sms.routes").router);

// email
router.use("/api", require("./api/api.notification.routes").router);

// dashboard
router.use("/api", require("./api/api.dashboard.routes").router);

// all about stations that can see of customers
router.use("/api", require("./api/api.stations.routes").router);

// products things
router.use("/api", require("./api/api.products.routes").router);

// cart
router.use("/api", require("./api/api.cart.routes").router);

//controls
router.use("/api", require("./api/api.controls.routes").router);

// sold container
router.use("/api", require("./api/api.soldcontainer.routes").router);

module.exports = {
  router,
};
