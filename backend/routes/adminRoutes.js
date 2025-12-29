const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔓 PUBLIC — only for initial hostel setup
router.post("/create-super-admin", adminController.createSuperAdmin);

// 🔐 PROTECTED — normal admin creation
router.post("/create", authMiddleware, adminController.createAdmin);

// 🔐 Get admin profile
router.get("/:email", authMiddleware, adminController.getAdminByEmail);

// Chat Routes
router.get('/students', authMiddleware, adminController.getAllStudents);
router.get('/chat/:studentId', authMiddleware, adminController.getChatMessages);
router.post('/chat/send', authMiddleware, adminController.sendMessage);

module.exports = router;
