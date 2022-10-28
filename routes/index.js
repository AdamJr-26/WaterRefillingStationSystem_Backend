const router = require('express').Router()


router.use("/auth", require("./auth.register.routes").router)
router.use("/auth", require("./auth.login.routes").router)

router.use("/api", require("./api.account.routes").router)

router.use("/api", require("./restricted.routes/restricted.routes.sample").router)
module.exports = {
    router
}