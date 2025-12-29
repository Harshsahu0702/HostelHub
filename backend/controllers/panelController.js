const Notification = require("../models/Notification");
const Complaint = require("../models/Complaint");
const AntiRagging = require("../models/AntiRaggingReport");
const MessMenu = require("../models/MessMenu");
const DepartureRequest = require("../models/DepartureRequest");
const FeeRecord = require("../models/FeeRecord");
const ChatMessage = require("../models/ChatMessage");
const Feedback = require("../models/Feedback");
const StudentRegistration = require("../models/StudentRegistration");

// 🔔 Notifications
exports.getNotificationsForStudent = async (req, res) => {
  try {
    const notes = await Notification.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

// 📢 Complaints
exports.createComplaint = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.user.id).select("hostelId fullName");
    console.log('Student found:', student);
    if (!student?.hostelId) {
      return res.status(400).json({ success: false, message: "Student hostelId not found" });
    }

    const payload = {
      ...req.body,
      studentId: req.user.id,
      studentName: student.fullName,
      hostelId: student.hostelId,
    };
    console.log('Complaint payload:', payload);

    const comp = new Complaint(payload);
    await comp.save();

    res.status(201).json({ success: true, data: comp });
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ success: false, message: err.message || "Error saving complaint" });
  }
};

exports.getComplaintsForStudent = async (req, res) => {
  try {
    const list = await Complaint.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching complaints" });
  }
};

// 🛑 Anti-ragging
exports.createAntiRagging = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.user.id).select("hostelId fullName");
    console.log('Student found for anti-ragging:', student);
    if (!student?.hostelId) {
      return res.status(400).json({ success: false, message: "Student hostelId not found" });
    }

    const payload = {
      ...req.body,
      studentId: req.user.id,
      studentName: student.fullName,
      hostelId: student.hostelId,
    };
    console.log('Anti-ragging payload:', payload);

    const r = new AntiRagging(payload);
    await r.save();

    res.status(201).json({ success: true, data: r });
  } catch (err) {
    console.error('Error creating anti-ragging report:', err);
    res.status(500).json({ success: false, message: err.message || "Error saving report" });
  }
};

exports.getAntiRaggingForStudent = async (req, res) => {
  try {
    const list = await AntiRagging.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching reports" });
  }
};

// 🍽️ Mess Menu
exports.getMessMenu = async (req, res) => {
  try {
    const menu = await MessMenu.findOne({
      hostelId: req.user.hostelId,
    }).sort({ createdAt: -1 });

    if (!menu) {
      return res.status(404).json({ success: false, message: "No menu found" });
    }

    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching menu" });
  }
};

// ✈️ Departure
exports.createDeparture = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.user.id).select("hostelId");
    if (!student?.hostelId) {
      return res.status(400).json({ success: false, message: "Student hostelId not found" });
    }

    const payload = {
      ...req.body,
      studentId: req.user.id,
      hostelId: student.hostelId,
    };

    const d = new DepartureRequest(payload);
    await d.save();

    res.status(201).json({ success: true, data: d });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating departure request" });
  }
};

exports.getDeparturesForStudent = async (req, res) => {
  try {
    const list = await DepartureRequest.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching departures" });
  }
};

// 💰 Fees
exports.getFeesForStudent = async (req, res) => {
  try {
    const list = await FeeRecord.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching fees" });
  }
};

// 💬 Chat
exports.postChatMessage = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.user.id).select("hostelId");
    if (!student?.hostelId) {
      return res.status(400).json({ success: false, message: "Student hostelId not found" });
    }

    const payload = {
      ...req.body,
      fromStudent: req.user.id,
      hostelId: student.hostelId,
    };

    if (!payload.text) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const m = new ChatMessage(payload);
    await m.save();

    res.status(201).json({ success: true, data: m });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving message" });
  }
};

exports.getChatForStudent = async (req, res) => {
  try {
    const list = await ChatMessage.find({
      $and: [
        { $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }] },
        { $or: [{ fromStudent: req.user.id }, { to: req.user.id }] },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching chat" });
  }
};

// ⭐ Feedback
exports.postFeedback = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.user.id).select("hostelId");
    if (!student?.hostelId) {
      return res.status(400).json({ success: false, message: "Student hostelId not found" });
    }

    const payload = {
      ...req.body,
      studentId: req.user.id,
      hostelId: student.hostelId,
    };

    const f = new Feedback(payload);
    await f.save();

    res.status(201).json({ success: true, data: f });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving feedback" });
  }
};

exports.getFeedbackForStudent = async (req, res) => {
  try {
    const list = await Feedback.find({
      studentId: req.user.id,
      $or: [{ hostelId: req.user.hostelId }, { hostelId: { $exists: false } }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching feedback" });
  }
};
// Admin endpoints for complaints by hostel ID
exports.getComplaintsForAdmin = async (req, res) => {
  try {
    const { hostelId } = req.query;
    console.log('getComplaintsForAdmin called with hostelId:', hostelId);
    const list = await Complaint.find({ hostelId }).sort({ createdAt: -1 });
    console.log('Found complaints:', list.length);
    res.json({ success: true, data: list });
  } catch (err) {
    console.error('Error in getComplaintsForAdmin:', err);
    res.status(500).json({ success: false, message: "Error fetching complaints" });
  }
};

exports.getAntiRaggingForAdmin = async (req, res) => {
  try {
    const { hostelId } = req.query;
    const list = await AntiRagging.find({ hostelId }).sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching anti-ragging reports" });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    console.error('Error updating complaint status:', err);
    res.status(500).json({ success: false, message: "Error updating complaint status" });
  }
};

// Admin departure endpoints
exports.getDeparturesForAdmin = async (req, res) => {
  try {
    const { hostelId } = req.query;
    console.log('getDeparturesForAdmin called with hostelId:', hostelId);

    const list = await DepartureRequest.find({ hostelId })
      .populate('studentId', 'fullName roomAllocated')
      .sort({ createdAt: -1 });

    console.log('Found departure requests:', list.length);
    res.json({ success: true, data: list });
  } catch (err) {
    console.error('Error in getDeparturesForAdmin:', err);
    res.status(500).json({ success: false, message: "Error fetching departure requests" });
  }
};

exports.updateDepartureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const departure = await DepartureRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('studentId', 'fullName roomAllocated');

    if (!departure) {
      return res.status(404).json({ success: false, message: "Departure request not found" });
    }

    res.json({ success: true, data: departure });
  } catch (err) {
    console.error('Error updating departure status:', err);
    res.status(500).json({ success: false, message: "Error updating departure status" });
  }
};

// Update anti-ragging status
exports.updateAntiRaggingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const antiRagging = await AntiRagging.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!antiRagging) {
      return res.status(404).json({ success: false, message: "Anti-ragging report not found" });
    }

    res.json({ success: true, data: antiRagging });
  } catch (err) {
    console.error('Error updating anti-ragging status:', err);
    res.status(500).json({ success: false, message: "Error updating anti-ragging status" });
  }
};