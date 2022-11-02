const router = require('express').Router()


router.use("/auth", require("./auth.register.routes").router)
router.use("/auth", require("./auth.login.logout.routes").router)
router.use("/auth", require("./auth.verify.routes").router)
router.use("/auth", require("./auth.authorize.users.routes").router)
router.use("/auth",require("./auth.update.users.routes").router)

router.use("/api", require("./api.account.routes").router)
router.use("/api", require("./restricted.routes/restricted.routes.sample").router)



module.exports = {
    router
}