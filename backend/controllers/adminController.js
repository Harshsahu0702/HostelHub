const Admin = require("../models/Admin");
const HostelSetup = require("../models/HostelSetup");
const StudentRegistration = require("../models/StudentRegistration");
const ChatMessage = require("../models/ChatMessage");

// ================= CREATE ADMIN =================
// (PROTECTED – hostelId comes from logged-in admin JWT)
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name, role, authorisation } = req.body;

    const hostelId = req.user.hostelId; // ✅ FROM JWT

    const existingAdmin = await Admin.findOne({
      email,
      hostelId,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists in this hostel.",
      });
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
      hostelId, // ✅ STORED
      role: role || "Admin",
      phone: "N/A",          // required by schema
      authorisation: authorisation || {},
    });

    await newAdmin.save();

    const adminData = newAdmin.toObject();
    delete adminData.password;

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: adminData,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ================= CREATE SUPER ADMIN =================
// (PROTECTED – one-time / system-level use)
exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password, hostelId } = req.body;

    // ✅ hostelId MUST come from body during setup
    if (!hostelId) {
      return res.status(400).json({
        success: false,
        message: "hostelId is required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists.",
      });
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
      hostelId,
      role: "Admin",
      phone: "N/A",
      authorisation: {},
    });

    await newAdmin.save();

    // ✅ Move hostel setup to next step
    await HostelSetup.findByIdAndUpdate(hostelId, {
      currentStep: 2,
    });

    res.status(201).json({
      success: true,
      message: "Super Admin created successfully",
      data: {
        id: newAdmin._id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ================= GET ADMIN BY EMAIL =================
// (PROTECTED – hostel based)
exports.getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const admin = await Admin.findOne({
      email,
      hostelId: req.user.hostelId, // ✅ HOSTEL CHECK
    })
      .select("-password")
      .populate("hostelId", "hostelName");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin by email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GET ALL STUDENTS =================
// (PROTECTED – hostel based)
exports.getAllStudents = async (req, res) => {
  try {
    const hostelId = req.user.hostelId;
    
    const students = await StudentRegistration.find({ hostelId })
      .select('-password')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GET CHAT MESSAGES =================
// (PROTECTED – hostel based)
exports.getChatMessages = async (req, res) => {
  try {
    const { studentId } = req.params;
    const hostelId = req.user.hostelId;

    const messages = await ChatMessage.find({
      hostelId,
      $or: [
        { fromStudent: studentId },
        { to: studentId }
      ]
    })
    .populate('fromStudent', 'fullName email')
    .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= SEND MESSAGE =================
// (PROTECTED – hostel based)
exports.sendMessage = async (req, res) => {
  try {
    const { studentId, text } = req.body;
    const hostelId = req.user.hostelId;

    if (!studentId || !text) {
      return res.status(400).json({
        success: false,
        message: "studentId and text are required",
      });
    }

    const message = new ChatMessage({
      hostelId,
      to: studentId,
      text,
      fromStudent: null, // Admin message
    });

    await message.save();

    const populatedMessage = await ChatMessage.findById(message._id)
      .populate('fromStudent', ' fullName email');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
