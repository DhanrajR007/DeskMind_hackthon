const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

router.post("/send", messageController.sendMessageController);
router.get(
  "/session/:sessionId",
  messageController.getMessagesBySessionController,
);

module.exports = router;
