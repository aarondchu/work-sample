const router = require("express").Router();
const loginController = require("./loginController");
const authorizationService = require("../jwtAuthorization/authorizationService");

router.post("/", loginController.login);
router.get("/info", authorizationService.verifyToken, loginController.getUserInfo);

module.exports = router;