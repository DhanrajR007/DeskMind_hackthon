const messageModel = require("../models/message.model");
const chatSessionModel = require("../models/chatsession.model");

// POST /sessions/:sessionId/messages  — send a message in a session
const sendMessageController = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { visitorId, agentId, clientId, text, sender } = req.body;

    // Validate required fields
    if (!text || !sender) {
      return res.status(400).json({ message: "text and sender are required" });
    }

    // Ensure the session exists and is not closed
    const session = await chatSessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    if (session.status === "closed") {
      return res
        .status(400)
        .json({ message: "Cannot send messages to a closed session" });
    }
    const aiMessageCount = await messageModel.countDocuments({
      sessionId,
      sender: "ai",
    });
    if (aiMessageCount > 5) {
      const ticket = await ticketModel.create({
        clientId: session.clientId,
        visitorId: session.visitorId,
        sessionId,
        status: "open",
      });
      session.ticketId = ticket._id;
      await session.save();
    }

    const message = await messageModel.create({
      visitorId: visitorId || session.visitorId,
      agentId,
      sessionId,
      clientId: clientId || session.clientId,
      text,
      sender,
    });

    res.status(201).json({
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /sessions/:sessionId/messages  — get all messages in a session (paginated)
const getMessagesBySessionController = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 50, sender } = req.query;

    const session = await chatSessionModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const filter = { sessionId };
    if (sender) filter.sender = sender;

    const messages = await messageModel
      .find(filter)
      .sort({ createdAt: 1 }) // oldest first — natural chat order
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await messageModel.countDocuments(filter);

    res.status(200).json({
      messages,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  sendMessageController,
  getMessagesBySessionController,
};
