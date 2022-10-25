const router = require('express').Router()


router.use("/auth", require("./auth.register.routes").router)
router.use("/api", require("./api.account.routes").router)
module.exports = {
    router
}