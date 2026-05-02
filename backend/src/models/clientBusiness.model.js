const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, "business name is required"],
  },
  businessEmail: {
    type: String,
    required: [true, "business email is required"],
    trim: true,
    lowercase: true,
    unique: [
      true,
      "business account already created with this email ,Please choose another email ",
    ],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  businessPassword: {
    type: String,
    required: [true, "password is required for account creating"],
    minlength: [6, "password length should be greater than 6"],
    select: false,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ownerId is required"],
  },
  planType: {
    type: String,
    enum: ["free", "premium", "enterprise"],
    default: "free",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const clientModel = mongoose.model("clientBusiness", clientSchema);

module.exports = clientModel;
