const Attendance = require("../models/Attendance");
const StudentRegistration = require("../models/StudentRegistration");
const Admin = require("../models/Admin");

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.getStudentAttendanceForAdmin = async (req, res) => {
  try {

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
