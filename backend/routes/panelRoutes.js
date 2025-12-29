const express = require("express");
const router = express.Router();
const panel = require("../controllers/panelController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔔 Notifications (student specific)
router.get("/notifications", authMiddleware, panel.getNotificationsForStudent);

// 📢 Complaints
router.post("/complaints", authMiddleware, panel.createComplaint);
router.get("/complaints", authMiddleware, panel.getComplaintsForStudent);

// 🛑 Anti-ragging
router.post("/antiragging", authMiddleware, panel.createAntiRagging);
router.get("/antiragging", authMiddleware, panel.getAntiRaggingForStudent);

// 🍽️ Mess menu (hostel based)
router.get("/mess", authMiddleware, panel.getMessMenu);

// ✈️ Departure
router.post("/departure", authMiddleware, panel.createDeparture);
router.get("/departure", authMiddleware, panel.getDeparturesForStudent);

// 💰 Fees
router.get("/fees", authMiddleware, panel.getFeesForStudent);

// 💬 Chat
router.post("/chat", authMiddleware, panel.postChatMessage);
router.get("/chat", authMiddleware, panel.getChatForStudent);

// ⭐ Feedback
router.post("/feedback", authMiddleware, panel.postFeedback);
router.get("/feedback", authMiddleware, panel.getFeedbackForStudent);

// Admin endpoints (add after line 15)
router.get("/complaints/admin", authMiddleware, panel.getComplaintsForAdmin);
router.get("/antiragging/admin", authMiddleware, panel.getAntiRaggingForAdmin);
router.get("/departure/admin", authMiddleware, panel.getDeparturesForAdmin);
router.put("/departure/:id/status", authMiddleware, panel.updateDepartureStatus);
router.put("/complaints/:id/status", authMiddleware, panel.updateComplaintStatus);
router.put("/antiragging/:id/status", authMiddleware, panel.updateAntiRaggingStatus);

module.exports = router;
