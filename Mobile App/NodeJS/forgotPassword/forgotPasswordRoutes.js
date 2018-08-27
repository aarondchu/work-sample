const router = require("express").Router();
const forgotPasswordController = require("./forgotPasswordController")

router.post("/", forgotPasswordController.forgotPassword)

module.exports = router;