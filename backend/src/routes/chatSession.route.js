const express = require("express");
const router = express.Router();
const chatSessionController = require("../controllers/chatSession.controller");

router.post("/create", chatSessionController.createSessionController);
router.get("/:id", chatSessionController.getSessionController);
router.get(
  "/client/:clientId",
  chatSessionController.getSessionsByClientController,
);
router.get(
  "/agent/:agentId",
  chatSessionController.getSessionsByAgentController,
);

module.exports = router;
