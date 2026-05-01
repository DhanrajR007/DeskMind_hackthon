const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required for account creating"],
    trim: true,
    lowercase: true,
    unique: [
      true,
      "account already created with this email ,Please choose another email ",
    ],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  name: {
    type: String,
    required: [true, "name is required for account creating"],
  },
  password: {
    type: String,
    required: [true, "password is required for account creating"],
    minlength: [6, "password length should be greater than 6"],
    select: false,
  },
  avatar: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
