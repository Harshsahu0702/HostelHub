const StudentRegistration = require("../models/StudentRegistration");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

exports.getStudentQR = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await StudentRegistration.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const qrImage = await QRCode.toDataURL(student.qrToken);

    res.status(200).json({
      success: true,
      qrImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= REGISTER A NEW STUDENT =================
// (PUBLIC – called by admin panel, hostelId must come from req.body or req.user)
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

// ================= GET ALL STUDENTS =================
// (PROTECTED – hostel-based data)
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

// ================= GET SINGLE STUDENT BY ID =================
// (PROTECTED – hostel-based + id-based)
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await StudentRegistration.findOne(
      { _id: id, hostelId: req.user.hostelId }, // ✅ DOUBLE CHECK
      { password: 0 }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student by id:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};
