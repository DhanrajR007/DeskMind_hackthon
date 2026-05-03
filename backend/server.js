require("dotenv").config();

const http = require("http");
const app = require("./app.js");
const { connectDb, isDbReady } = require("./src/config/db.js");
const { initSocket } = require("./src/socket/socket.js");

const PORT = process.env.PORT || 3000;

// DB guard
app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "DB not connected" });
  }
  next();
});

// create server
const server = http.createServer(app);

// 🔥 just call this
initSocket(server);

// start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// connect DB
connectDb().catch((err) => {
  console.error("DB error:", err.message);
});
