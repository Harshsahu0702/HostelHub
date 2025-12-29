const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

// Get room statistics (PROTECTED – hostel based)
router.get("/stats", authMiddleware, roomController.getRoomStats);

module.exports = router;
