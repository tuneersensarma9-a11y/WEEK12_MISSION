const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Client Connected: ${socket.id}`);

  // Receive message from client
  socket.on("send_message", (data) => {
    console.log("Message Received:", data);

    // Send message to all connected clients
    io.emit("receive_message", data);
  });

  // User started typing
socket.on("typing", () => {
  console.log("Typing event received");
  socket.broadcast.emit("user_typing");
});

// User stopped typing
socket.on("stop_typing", () => {
  console.log("Stop typing event received");
  socket.broadcast.emit("user_stopped_typing");
});
  socket.on("disconnect", () => {
    console.log(`Client Disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("Socket.io Server Running");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});