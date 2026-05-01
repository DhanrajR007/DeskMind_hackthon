const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
// const sendEmail = require("../services/email.service");
const blackListModel = require("../models/blackList.model");
const { getAvatar } = require("../utils/helper");

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  isUserExist = await UserModel.findOne({ email: email });
  if (isUserExist) {
    return res.status(422).json({
      message: "User is already exist with this email",
    });
  }
  const avatar = await getAvatar(email);
  const user = await UserModel.create({
    name: name,
    email: email,
    password: password,
    avatar: avatar,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
    message: "user created succesfully",
  });
  // await sendEmail.sendRegistrationEmail(user.email, user.name);
};
const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email: email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "invalid email and password",
    });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "invalid email and password",
    });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
    message: "user created succesfully",
  });
};

const logoutController = async (req, res) => {
 const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({
      message: "logout successfully",
    });
  }
  res.clearCookie('token')
  const blacklisted = await blackListModel.create({
    token,
  });

  return res.status(200).json({
    message: "Logout successfully",
    blacklisted,
  });
};

module.exports = { registerController, loginController, logoutController };
