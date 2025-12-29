const express = require("express");
const router = express.Router();
const adminAllotController = require("../controllers/adminAllotController");
const authMiddleware = require("../middleware/authMiddleware");

// 🏠 Rooms (hostel based)
router.get("/rooms", authMiddleware, adminAllotController.getAllRooms);
router.get("/available-rooms", authMiddleware, adminAllotController.getAvailableRooms);

// 🎯 Room allotment
router.post("/auto-allot", authMiddleware, adminAllotController.autoAllot);
router.post("/manual-allot", authMiddleware, adminAllotController.manualAllot);
router.post("/remove-allotment", authMiddleware, adminAllotController.removeAllotment);
// router.post("/auto-allot-by-type", authMiddleware, adminAllotController.autoAllotByType);

// 👨‍🎓 Students list for allotment (hostel + optional room type)
router.get("/students", authMiddleware, async (req, res) => {
  try {
    const StudentRegistration = require("../models/StudentRegistration");
    const { roomType } = req.query;

    const query = {
      hostelId: req.user.hostelId, // ✅ HOSTEL FILTER
    };

    if (roomType && roomType !== "All") {
      query.preferredRoomType = { $regex: roomType, $options: "i" };
    }

    const students = await StudentRegistration.find(query, { password: 0 });

    res.json({
      success: true,
      data: students,
    });
  } catch (err) {
    console.error("admin students route error", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
