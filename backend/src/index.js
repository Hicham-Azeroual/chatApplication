import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js"; // Import notification routes
import statuRoutes from "./routes/status.route.js";
import groupRoutes from "./routes/group.route.js"; // Import group routes
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Increase payload size limit (e.g., 10MB)
app.use(express.json({ limit: "50mb" })); // Allow JSON payloads up to 10MB
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Allow URL-encoded payloads up to 10MB
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes); // Add notification routes
app.use("/api/status",statuRoutes);
app.use("/api/groups",groupRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});