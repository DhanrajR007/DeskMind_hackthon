// - id
// - clientId (ref → Client)
// - sessionId (ref → ChatSession)
// - title
// - description
// - status (open/inProgress/onHold/resolved/closed)
// - priority (low/medium/high/critical)
// - assignedAgent (ref → Agent)
// - escalatedTo (ref → Agent)
// - history []
//     - action
//     - doneBy
//     - timestamp
// - internalNotes []
// - aiSuggestedReply
// - resolvedAt
// - createdAt
// - updatedAt

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSession",
    required: [true, "session id is required"],
  },
  customerName: {
    type: String,
    required: [true, "customer name is required"],
  },
  customerEmail: {
    type: String,
    required: [true, "customer email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address",
    ],
  },
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  //   aiSuggestedReply: String,
  resolvedAt: Date,
});

const TicketModel = mongoose.model("Ticket", ticketSchema);
module.exports = TicketModel;
