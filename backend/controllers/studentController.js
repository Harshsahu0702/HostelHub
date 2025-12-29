const StudentRegistration = require("../models/StudentRegistration");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

exports.registerStudent = async (req, res) => {
  try {
    const {
      hostelId, // ✅ REQUIRED
      fullName,
      rollNumber,
      email,
      phoneNumber,
      address,
      course,
      year,
      guardianName,
      relationship,
      guardianEmail,
      guardianPhone,
      preferredRoomType,
    } = req.body;

    if (!hostelId) {
      return res.status(400).json({
        success: false,
        message: "hostelId is required",
      });
    }

    // Check if student with same email or roll number already exists IN SAME HOSTEL
    const existingStudent = await StudentRegistration.findOne({
      hostelId,
      $or: [{ email }, { rollNumber }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or roll number already exists.",
      });
    }

    const qrToken = uuidv4();

    // Create new student
    const newStudent = new StudentRegistration({
      hostelId, // ✅ STORED
      fullName,
      rollNumber,
      email,
      phoneNumber,
      address,
      course,
      year,
      guardianName,
      relationship,
      guardianEmail,
      guardianPhone,
      preferredRoomType,
      password: phoneNumber, // using phone number as password
      qrToken,
    });

    await newStudent.save();

    const studentData = newStudent.toObject();
    delete studentData.password;

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: studentData,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({
      success: false,
      message: "Error registering student",
      error: error.message,
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentRegistration.find(
      { hostelId: req.user.hostelId }, // ✅ FILTER BY HOSTEL
      { password: 0 }
    );

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};
