const express = require("express");
const router = express.Router();

const {
  sendPersonalMessage,
  getPersonalMessages,
  sendGroupMessage,
  getGroupMessages,
  getAdminsForChat,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * =========================
 * PERSONAL CHAT
 * =========================
 */

// student ↔ admin (send)
router.post(
  "/personal",
  authMiddleware,
  sendPersonalMessage
);

// student ↔ admin (fetch)
router.get(
  "/personal/:receiverId",
  authMiddleware,
  getPersonalMessages
);

/**
 * =========================
 * GROUP CHAT
 * =========================
 */

// send group message
router.post(
  "/group",
  authMiddleware,
  sendGroupMessage
);

// fetch group messages
router.get(
  "/group",
  authMiddleware,
  getGroupMessages
);

// get admins of same hostel (for student chat)
router.get(
  "/admins",
  authMiddleware,
  getAdminsForChat
);

module.exports = router;
