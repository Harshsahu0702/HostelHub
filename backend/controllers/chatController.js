const ChatMessage = require("../models/ChatMessage");
const Admin = require("../models/Admin");

/**
 * =========================
 * PERSONAL CHAT
 * =========================
 */

// Send personal message (student ↔ admin ONLY)
exports.sendPersonalMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const { id, role, hostelId } = req.user;

    if (!receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "receiverId and text are required",
      });
    }

    const message = await ChatMessage.create({
      hostelId,
      chatType: "personal",
      senderType: role,
      senderId: id,
      receiverType: role === "student" ? "admin" : "student",
      receiverId,
      text,
    });

    // 🔥 REAL-TIME EMIT (to receiver)
    req.io.to(receiverId.toString()).emit("personalMessage", message);

    // 🔥 ALSO emit to sender (for multi-tab support)
    req.io.to(id.toString()).emit("personalMessage", message);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get personal messages (student ↔ admin)
exports.getPersonalMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { id, hostelId } = req.user;

    const messages = await ChatMessage.find({
      hostelId,
      chatType: "personal",
      $or: [
        { senderId: id, receiverId },
        { senderId: receiverId, receiverId: id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * =========================
 * GROUP CHAT
 * =========================
 */

// Send group message (student OR admin)
exports.sendGroupMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id, role, hostelId } = req.user;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const message = await ChatMessage.create({
      hostelId,
      chatType: "group",
      senderType: role,
      senderId: id,
      text,
    });

    // 🔥 REAL-TIME EMIT (to hostel room)
    req.io.to(hostelId.toString()).emit("groupMessage", message);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get group messages (hostel scoped)
exports.getGroupMessages = async (req, res) => {
  try {
    const { hostelId } = req.user;

    const messages = await ChatMessage.find({
      hostelId,
      chatType: "group",
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET ADMINS FOR STUDENT CHAT
// =========================
exports.getAdminsForChat = async (req, res) => {
  try {
    const { hostelId, role } = req.user;

    // only students should call this
    if (role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const admins = await Admin.find({ hostelId })
      .select("_id name role email");

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
