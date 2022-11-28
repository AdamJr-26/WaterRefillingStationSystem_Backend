const router = require('express').Router()


router.use("/auth", require("./auth/auth.register.routes").router)
router.use("/auth", require("./auth/auth.login.logout.routes").router)
router.use("/auth", require("./auth/auth.verify.routes").router)
router.use("/auth", require("./auth/auth.authorize.users.routes").router)
router.use("/auth",require("./auth/auth.update.users.routes").router)


router.use("/api", require("./api/api.profile.users.routes").router)
router.use("/api", require("./auth/auth.account.routes").router)
router.use("/api", require("./restricted.routes/restricted.routes.sample").router)

// inventory
router.use("/api", require("./api/api.inventory.routes").router)

// employee
router.use("/api", require("./api/api.employee.routes").router)

// personel
router.use("/api", require("./api/api.personel.routes").router)
module.exports = {
    router
}