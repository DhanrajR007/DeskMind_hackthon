const express = require("express");
const authController = require("../controllers/auth.controller");

const route = express.Router();

route.post("/register", authController.registerController);
route.post("/login", authController.loginController);

route.post("/logout", authController.logoutController);

module.exports = route;
