const express = require("express");
const router = express.Router();
const chatSessionController = require("../controllers/chatSession.controller");

router.post("/create", chatSessionController.createSessionController);
router.get("/:id", chatSessionController.getSessionController);
router.post("/close/:id", chatSessionController.closeSessionController);
module.exports = router;
