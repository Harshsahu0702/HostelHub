const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  scanAttendance,
  toggleAttendance,
  getMyAttendance,
  getStudentAttendanceForAdmin,
  getTodayAttendanceSummary,
} = require("../controllers/attendanceController");

/**
 * ===============================
 * ADMIN: Scan QR → Get Status
 * ===============================
 */
router.post("/scan", authMiddleware, scanAttendance);

/**
 * ===============================
 * ADMIN: Toggle Attendance Status
 * ===============================
 */
router.post("/toggle", authMiddleware, toggleAttendance);

/**
 * ===============================
 * STUDENT: Get Own Attendance
 * ===============================
 */
router.get("/student/me", authMiddleware, getMyAttendance);

/**
 * ===============================
 * ADMIN: Get Attendance of a Student
 * ===============================
 */
router.get(
  "/admin/student/:id",
  authMiddleware,
  getStudentAttendanceForAdmin
);

/**
 * ===============================
 * ADMIN: Today's Attendance Summary
 * ===============================
 */
router.get(
  "/today-summary",
  authMiddleware,
  getTodayAttendanceSummary
);

module.exports = router;
