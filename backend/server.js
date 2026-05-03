const http = require("http");
const app = require("./app.js");
const { connectDb, isDbReady } = require("./src/config/db.js");
const { initSocket } = require("./src/socket/socket.js");

const PORT = process.env.PORT || 3000;

// ─── DB readiness guard ──────────────────────────────────────────────────────
app.use("/api", (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "DB not connected" });
  }
  next();
});

// ─── Create HTTP server and attach Socket.IO ─────────────────────────────────
const server = http.createServer(app);
initSocket(server);

// ─── Start server ────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO is ready`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Server startup failed: port ${PORT} is already in use.`);
    return;
  }
  if (error.code === "EPERM") {
    console.error(
      `Server startup failed: permission denied while binding to port ${PORT}.`
    );
    return;
  }
  console.error("Server startup failed:", error.message);
});

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
connectDb().catch((error) => {
  console.error("Database connection failed:", error.message);
  console.error(
    "The API will stay up, but form routes will return 503 until MongoDB connects successfully."
  );
});
