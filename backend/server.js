const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "https://hostel-hubb.vercel.app", // frontend URL
  credentials: true,
}));
app.use(express.json());

/* ================= CREATE HTTP SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET.IO SETUP ================= */
const io = new Server(server, {
  cors: {
    origin: "https://hostel-hubb.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ================= SOCKET EVENTS ================= */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // join personal room (student/admin id)
  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log("👤 Joined user room:", userId);
  });

  // join hostel group room
  socket.on("joinHostel", (hostelId) => {
    socket.join(hostelId);
    console.log("🏠 Joined hostel room:", hostelId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* ================= ROUTES ================= */
const authRoutes = require("./routes/authRoutes");
const hostelSetupRoutes = require("./routes/hostelSetup");
const roomRoutes = require("./routes/roomRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAllotRoutes = require("./routes/adminAllotRoutes");
const panelRoutes = require("./routes/panelRoutes");
const chatRoutes = require("./routes/chatRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/hostel-setup", hostelSetupRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admin", adminAllotRoutes);
app.use("/api/panel", panelRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/attendance", attendanceRoutes);

/* ================= DB ================= */
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostel-management";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB error:", err));

/* ================= START SERVER ================= */
const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
