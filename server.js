require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { Server } = require("socket.io");
const { GenerateAI } = require("./src/services/ai.service");

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("New User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", async (data) => {
    chatHistory.push({ role: "user", parts: { text: data } });

    const response = await GenerateAI(chatHistory);

    chatHistory.push({ role: "model", parts: { text: response } });

    socket.emit("ai-response", response);
  });
});

// Run server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Allowed frontend: ${FRONTEND_URL}`);
});
