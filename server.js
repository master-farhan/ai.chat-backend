require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { GenerateAI } = require("./src/services/ai.service");

const app = express();

// ✅ CORS setup
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Basic test route (optional)
app.get("/", (req, res) => {
  res.send("✅ AI Chat Backend is running...");
});

// ✅ HTTP server create
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

// ✅ Chat memory
const chatHistory = [];

io.on("connection", (socket) => {
  console.log("⚡ New User connected");

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });

  socket.on("message", async (data) => {
    try {
      chatHistory.push({ role: "user", parts: { text: data } });

      const response = await GenerateAI(chatHistory);

      chatHistory.push({ role: "model", parts: { text: response } });

      socket.emit("ai-response", response);
    } catch (error) {
      console.error("AI error:", error);
      socket.emit("ai-response", "⚠️ Something went wrong, please try again.");
    }
  });
});

// ✅ Render auto-assigns PORT (don’t set manually)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Allowed frontend: ${FRONTEND_URL}`);
});
