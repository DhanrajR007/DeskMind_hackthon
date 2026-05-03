const agentModel = require("../models/agent.model");
const clientModel = require("../models/clientBusiness.model");

const createAgentController = async (req, res) => {
  try {
    const { clientId, name, email, password } = req.body;
    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }
    const client = await clientModel.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    const existingAgent = await agentModel.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: "Agent already exists" });
    }
    const agent = await agentModel.create({ clientId, name, email, password });
    res
      .status(201)
      .json({ message: "Agent created successfully", data: agent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllAgentsController = async (req, res) => {
  try {
    const agents = await agentModel.find();
    res.status(200).json({ data: agents });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAgentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await agentModel.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json({ data: agent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAgentsByClientController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const agents = await agentModel.find({ clientId });
    res.status(200).json({ data: agents });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateAgentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const agent = await agentModel.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true },
    );
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res
      .status(200)
      .json({ message: "Agent updated successfully", data: agent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteAgentController = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await agentModel.findByIdAndDelete(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res
      .status(200)
      .json({ message: "Agent deleted successfully", data: agent });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createAgentController,
  getAllAgentsController,
  getAgentByIdController,
  getAgentsByClientController,
  updateAgentController,
  deleteAgentController,
};
