require("dotenv").config()
const app = require("./app.js");
const { connectDb, isDbReady } = require("./src/config/db.js");
const PORT =  3000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service.js")


const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors:{
    origin: "http://localhost:5173",
  }
 });

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected")

  socket.on("disconnect",()=>{
    console.log("A user disconnected")
  })

  socket.on("ai-message",async (data)=>{
    console.log("recived ai message:", data)

    chatHistory.push({
      role: "user",
      parts: [{text:data}]
    })

    const response = await generateResponse(chatHistory);
    console.log("AI response:",response);

    chatHistory.push({
      role: "model",
      parts: [{text:response}]
    })

    socket.emit("ai-message-response",response)

  })
});


app.use('/api', (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "DB not connected" })
  }
  next()
})


const server = httpServer.listen(PORT, () => {
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
