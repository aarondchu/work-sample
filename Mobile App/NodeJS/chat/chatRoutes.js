const router = require("express").Router();
const chatController = require("./chatController");
const authService = require("../jwtAuthorization/authorizationService")

router.get("/user/:userId", chatController.getUserChats);
router.post("/messages/:userId", chatController.addMessage);
router.get("/:id/:userId", chatController.getUserMessages);

module.exports = router;