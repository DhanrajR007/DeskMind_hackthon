// - id
// - clientId (ref → Client)
// - name
// - email
// - password (hashed)
// - status (online/offline/busy)
// - totalTicketsResolved
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agentSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "online",
    },
    totalTicketsResolved: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const AgentModel = mongoose.model("Agent", agentSchema);
module.exports = AgentModel;
