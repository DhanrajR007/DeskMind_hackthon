// - id
// - clientId (ref → Client)
// - visitorId (anonymous, generated per session)
// - status (active/closed/transferred)
// - startedAt
// - endedAt
// - customerFeedback
const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "client id is required"],
    },
    visitorId: {
      type: String,
      required: [true, "visitor id is required"],
    },
    status: {
      type: String,
      enum: ["active", "closed", "transferred"],
      default: "active",
    },
    customerFeedback: {
      type: String,
    },
    aiMessageCount: {
      type: Number,
      default: 0,
    },
    isTicketCreated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const chatSessionModel = mongoose.model("ChatSession", chatSessionSchema);
module.exports = chatSessionModel;
