const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controller");

router.post("/", agentController.createAgentController);
router.get("/", agentController.getAllAgentsController);
router.get("/:id", agentController.getAgentByIdController);
router.get("/client/:clientId", agentController.getAgentsByClientController);
router.put("/:id", agentController.updateAgentController);
router.delete("/:id", agentController.deleteAgentController);

module.exports = router;
