const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
const hostelSetupRoutes = require("./routes/hostelSetup");
const adminRoutes = require("./routes/adminRoutes");

// API Routes
app.use("/api/hostel-setup", hostelSetupRoutes);
app.use("/api/admins", adminRoutes);

// Database connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostel-management";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
