const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store messages in memory (not suitable for production)
let messages = [];

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send existing messages to the new client
  socket.emit("messages", messages);

  // Receive new message from client
  socket.on("message", (message) => {
    messages.push(message);
    // Broadcast the new message to all clients
    io.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
