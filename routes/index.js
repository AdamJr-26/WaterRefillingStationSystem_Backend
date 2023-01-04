const router = require("express").Router();

// auth
router.use("/auth", require("./auth/auth.register.routes").router);
router.use("/auth", require("./auth/auth.login.logout.routes").router);
router.use("/auth", require("./auth/auth.verify.routes").router);
router.use("/auth", require("./auth/auth.authorize.users.routes").router);
router.use("/auth", require("./auth/auth.update.users.routes").router);

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

// personel
router.use("/api", require("./api/api.personel.routes").router);

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

module.exports = {
  router,
};
