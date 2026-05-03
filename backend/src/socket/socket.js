const { Server } = require("socket.io");
const messageModel = require("../models/message.model");
const chatSessionModel = require("../models/chatsession.model");
const geminiAI = require("../services/ai.service");
const clientModel = require("../models/clientBusiness.model");
const { systemInstruction } = require("../utils/custominstructionbuild");

let io;

/**
 * Initializes Socket.IO on the given HTTP server.
 * @param {import("http").Server} httpServer
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // ─── Join a chat session room ────────────────────────────────────────────
    // Payload: { sessionId }
    socket.on("join_session", (data) => {
      console.log("RAW DATA:", data);

      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      const sessionId = parsed?.sessionId;

      if (!sessionId) {
        console.log("No sessionId received ❌");
        return;
      }

      socket.join(sessionId);
      console.log(`[Socket.IO] ${socket.id} joined session room: ${sessionId}`);
    });

    // ─── Leave a chat session room ───────────────────────────────────────────
    // Payload: { sessionId }
    socket.on("leave_session", ({ sessionId }) => {
      if (!sessionId) return;
      socket.leave(sessionId);
      console.log(`[Socket.IO] ${socket.id} left session room: ${sessionId}`);
    });

    // ─── Send message (persists to DB and broadcasts to room) ───────────────
    // Payload: { sessionId, visitorId?, agentId?, clientId, text, sender }
    socket.on("send_message", async (data) => {
      try {
        console.log("RAW DATA:", data);

        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        const { sessionId, visitorId, clientId, text, sender } = parsed;

        if (!sessionId || !text || !sender) {
          socket.emit("error", {
            message: "sessionId, text, and sender are required",
          });
          return;
        }

        // ✅ check session
        const session = await chatSessionModel.findById(sessionId);
        if (!session) {
          socket.emit("error", { message: "Chat session not found" });
          return;
        }

        if (session.status === "closed") {
          socket.emit("error", {
            message: "Cannot send messages to a closed session",
          });
          return;
        }

        // ✅ check room joined
        const room = io.sockets.adapter.rooms.get(sessionId);
        if (!room || !room.has(socket.id)) {
          socket.emit("error", {
            message: "You must join the session before sending messages",
          });
          return;
        }

        // ✅ save user message
        const userMessage = await messageModel.create({
          sessionId,
          visitorId: visitorId || session.visitorId,
          clientId: clientId || session.clientId,
          text,
          sender,
        });

        // ✅ send user message
        io.to(sessionId).emit("new_message", {
          sender: "visitor",
          userMessage,
        });

        if (sender === "visitor" && !session.isTicketCreated) {
          // 🤖 AI typing start
          socket.to(sessionId).emit("typing", { sender: "ai" });
          const clientData = await clientModel.findById(session.clientId);
          const instruction = systemInstruction(clientData.ai_config);
          // 🤖 call AI
          const aiReplyText = await geminiAI(instruction, text);
          // const parsedAI = typeof aiReplyText === "string" ? JSON.parse(aiReplyText) : aiReplyText;
          // 🤖 stop typing
          socket.to(sessionId).emit("stop_typing", { sender: "ai" });

          // ✅ save AI message
          const aiMessage = await messageModel.create({
            sessionId,
            visitorId: null,
            clientId: session.clientId,
            text: aiReplyText,
            sender: "ai",
          });

          io.to(sessionId).emit("new_message", {
            sender: "AI",
            aiMessage,
          });
        }
        // only for user messages
        if (sender === "visitor") {
          session.aiMessageCount += 1;

          // 🔥 limit reached
          if (session.aiMessageCount > 5) {
            session.isTicketCreated = true;
            await session.save();

            // notify user
            io.to(sessionId).emit("new_message", {
              message: "Your issue is forwarded to agent 👨‍💻",
              sender: "system",
            });

            return;
          }

          await session.save();
        }
      } catch (err) {
        console.error("[Socket.IO] send_message error:", err.message);
        socket.emit("error", {
          message: err.message || "Internal server error",
        });
      }
    });
    // ─── Session closed notification ────────────────────────────────────────
    // Payload: { sessionId }
    socket.on("session_closed", ({ sessionId }) => {
      if (!sessionId) return;
      io.to(sessionId).emit("session_closed", { sessionId });
    });

    // ─── Typing indicator ───────────────────────────────────────────────────
    // Payload: { sessionId, sender }
    socket.on("typing", ({ sessionId, sender }) => {
      if (!sessionId) return;
      socket.to(sessionId).emit("typing", { sender });
    });

    socket.on("stop_typing", ({ sessionId, sender }) => {
      if (!sessionId) return;
      socket.to(sessionId).emit("stop_typing", { sender });
    });

    // ─── Disconnect ─────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Returns the initialized Socket.IO instance.
 * Useful for emitting events from controllers/services.
 */
const getIo = () => {
  if (!io)
    throw new Error(
      "Socket.IO has not been initialized. Call initSocket() first.",
    );
  return io;
};

module.exports = { initSocket, getIo };
