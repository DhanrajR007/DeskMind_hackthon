// - id
// - clientId (ref → Client)
// - question
// - answer
// - category
// - tags []

const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "client id is required"],
  },
  question: {
    type: String,
    required: [true, "question is required"],
  },
  answer: {
    type: String,
    required: [true, "answer is required"],
  },
  category: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const faqModel = mongoose.model("Faq", faqSchema);
module.exports = faqModel;
