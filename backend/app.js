const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./src/routes/auth.route");
const businessRoute = require("./src/routes/bussiness.route");
const agentRoute = require("./src/routes/agent.route");
const chatsessionRoute = require("./src/routes/chatsession.route");
const messagesRoute = require("./src/routes/message.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoute);
app.use("/api/business", businessRoute);
app.use("/api/agent", agentRoute);
app.use("/api/chatsession", chatsessionRoute);
app.use("/api/message", messagesRoute);

module.exports = app;
