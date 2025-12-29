const Attendance = require("../models/Attendance");
const StudentRegistration = require("../models/StudentRegistration");
const Admin = require("../models/Admin");

/**
 * Utility: Normalize date to start of day (00:00:00)
 */
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * =================================================
 * ADMIN: Scan QR → Get Current Attendance Status
 * =================================================
 * POST /api/attendance/scan
 * (NO TOGGLE HERE)
 */
exports.scanAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR token is required",
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.authorisation?.qrscans) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to scan QR codes",
      });
    }

    const student = await StudentRegistration.findOne({ qrToken });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const today = getStartOfDay(new Date());

    let attendance = await Attendance.findOne({
      studentId: student._id,
      date: today,
    });

    // If not marked yet today → treat as Absent (not created yet)
    const currentStatus = attendance ? attendance.status : "Absent";

    return res.status(200).json({
      success: true,
      message: "Attendance status fetched",
      data: {
        student: {
          id: student._id,
          name: student.fullName,
          rollNumber: student.rollNumber,
        },
        date: today,
        status: currentStatus,
        alreadyMarked: !!attendance,
      },
    });
  } catch (error) {
    console.error("Scan attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * =================================================
 * ADMIN: Toggle Attendance Status
 * =================================================
 * POST /api/attendance/toggle
 */
exports.toggleAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.authorisation?.qrscans) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to change attendance",
      });
    }

    const student = await StudentRegistration.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const today = getStartOfDay(new Date());

    let attendance = await Attendance.findOne({
      studentId: student._id,
      date: today,
    });

    if (!attendance) {
      // First time toggle → create as Present
      attendance = await Attendance.create({
        studentId: student._id,
        hostelId: student.hostelId,
        date: today,
        status: "Present",
        markedBy: admin._id,
      });
    } else {
      // Toggle existing status
      attendance.status =
        attendance.status === "Present" ? "Absent" : "Present";
      attendance.markedBy = admin._id;
      await attendance.save();
    }

    return res.status(200).json({
      success: true,
      message: "Attendance status updated",
      data: {
        studentId: student._id,
        status: attendance.status,
      },
    });
  } catch (error) {
    console.error("Toggle attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ===============================
 * STUDENT: Get Own Attendance
 * ===============================
 * GET /api/attendance/student/me
 */
exports.getMyAttendance = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const attendance = await Attendance.find({
      studentId: req.user.id,
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Get student attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ===============================
 * ADMIN: Get Attendance of a Student
 * ===============================
 * GET /api/attendance/admin/student/:id
 */
exports.getStudentAttendanceForAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const attendance = await Attendance.find({
      studentId: id,
      hostelId: req.user.hostelId,
    }).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Admin get student attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ===============================
 * ADMIN: Today's Attendance Summary
 * ===============================
 * GET /api/attendance/today-summary
 */
exports.getTodayAttendanceSummary = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const today = getStartOfDay(new Date());

    const records = await Attendance.find({
      hostelId: req.user.hostelId,
      date: today,
    });

    const presentCount = records.filter(
      (r) => r.status === "Present"
    ).length;

    const absentCount = records.filter(
      (r) => r.status === "Absent"
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        date: today,
        totalMarked: records.length,
        present: presentCount,
        absent: absentCount,
      },
    });
  } catch (error) {
    console.error("Today summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
