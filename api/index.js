const router = require("express").Router()

//1st param : api path (:host/auth/...)

router.use("/test", require("./testApi"))
router.use("/auth", require("./authApi"))
router.use("/user", require("./examDataApi"))

module.exports = router;