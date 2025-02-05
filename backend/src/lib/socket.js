import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow connections from this origin
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

// Store online users: { userId: socketId }
const userSocketMap = {};

// Function to get the socket ID of a user by their userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Get userId from the handshake query
  const userId = socket.handshake.query.userId;

  // Validate userId
  if (typeof userId === "string" && userId.trim() !== "") {
    // Map userId to socketId
    userSocketMap[userId] = socket.id;

    // Emit the list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.error("Invalid userId:", userId);
  }

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove the user from userSocketMap
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];

      // Emit the updated list of online users to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });
});

// Export the required modules
export { io, app, server };