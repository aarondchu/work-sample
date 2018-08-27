const router = require("express").Router();
const registerController = require("./registerController")

router.post("/", registerController.register);

module.exports = router;