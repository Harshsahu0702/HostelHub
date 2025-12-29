const mongoose = require("mongoose");

const studentRegistrationSchema = new mongoose.Schema({
  // Student Information
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },

  // Guardian Information
  guardianName: { type: String, required: true },
  relationship: { type: String, required: true },
  guardianEmail: { type: String, required: true },
  guardianPhone: { type: String, required: true },

  // Hostel Preference
  preferredRoomType: { type: String, required: true },

  // System Fields
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected

  // Additional Fields
  roomId: { type: mongoose.Schema.Types.ObjectId, default: null },
  roomAllocated: { type: String, default: '' },
  allotmentStatus: { type: String, enum: ["PENDING", "ALLOTTED"], default: "PENDING" },
  // Authentication
  password: { type: String, required: true },

  // QR Identity
  qrToken: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("StudentRegistration", studentRegistrationSchema);
