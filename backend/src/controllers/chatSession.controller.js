const chatSessionModel = require("../models/chatsession.model");
const messageModel = require("../models/message.model");

// POST /sessions  — start a new chat session (called by widget/visitor side)
const createSessionController = async (req, res) => {
  try {
    const { clientId, visitorId } = req.body;

    if (!clientId || !visitorId) {
      return res
        .status(400)
        .json({ message: "clientId and visitorId are required" });
    }

    // Prevent duplicate active sessions for the same visitor on the same client
    const existingActive = await chatSessionModel.findOne({
      clientId,
      visitorId,
      status: "active",
    });

    if (existingActive) {
      return res.status(200).json({
        message: "Active session already exists",
        session: existingActive,
      });
    }

    const session = await chatSessionModel.create({ clientId, visitorId });

    res.status(201).json({
      message: "Chat session started",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /sessions/:id  — get a single session by ID
const getSessionController = async (req, res) => {
  try {
    const session = await chatSessionModel
      .findById(req.params.id)
      .populate("clientId", "businessName businessEmail");

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// PATCH /sessions/:id/close  — close a session and optionally save feedback
const closeSessionController = async (req, res) => {
  try {
    const { customerFeedback } = req.body;

    const session = await chatSessionModel.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    if (session.status === "closed") {
      return res.status(400).json({ message: "Session is already closed" });
    }

    session.status = "closed";
    if (customerFeedback) session.customerFeedback = customerFeedback;
    await session.save();

    res.status(200).json({
      message: "Chat session closed",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createSessionController,
  getSessionController,
  closeSessionController,
};
