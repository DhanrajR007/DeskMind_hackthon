const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controller");

router.post("/create", agentController.createAgentController);
router.get("/all", agentController.getAllAgentsController);
router.get("/:id", agentController.getAgentByIdController);
router.get("/client/:clientId", agentController.getAgentsByClientController);
router.put("/:id", agentController.updateAgentController);
router.delete("/:id", agentController.deleteAgentController);

module.exports = router;
