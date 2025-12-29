const StudentRegistration = require("../models/StudentRegistration");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// JWT TOKEN GENERATOR
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ================= STUDENT LOGIN =================
exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const student = await StudentRegistration.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Password check (plain text as per current system)
    if (student.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT (IMPORTANT)
    const token = generateToken({
      id: student._id,
      hostelId: student.hostelId,
      role: "student",
    });

    // Remove password from response
    const { password: _, ...studentData } = student.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: studentData,
      redirect: "/student/dashboard",
    });
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

// ================= ADMIN LOGIN =================
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT (IMPORTANT)
    const token = generateToken({
      id: admin._id,
      hostelId: admin.hostelId,
      role: "admin",
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      email: admin.email,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
