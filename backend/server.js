const app = require("./app.js");
const { connectDb, isDbReady } = require("./src/config/db.js");
const PORT =  3000;



app.use('/api', (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "DB not connected" })
  }
  next()
})


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Server startup failed: port ${port} is already in use.`);
    return;
  }

  if (error.code === "EPERM") {
    console.error(
      `Server startup failed: permission denied while binding to ${host}:${port}.`,
    );
    return;
  }

  console.error("Server startup failed:", error.message);
});

connectDb().catch((error) => {
  console.error("Database connection failed:", error.message);
  console.error(
    "The API will stay up, but form routes will return 503 until MongoDB connects successfully.",
  );
});
