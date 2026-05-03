// - id
// - sessionId (ref → ChatSession)
// - clientId (ref → Client)
// - text
// - sender (visitor/ai/agent)

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: [true, "session id is required"],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "client id is required"],
    },
    text: {
      type: String,
      required: [true, "message text is required"],
    },
    sender: {
      type: String,
      enum: ["visitor", "ai", "agent"],
      required: [true, "sender is required"],
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
