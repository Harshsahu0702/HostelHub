const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // Reference to Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentRegistration",
      required: true,
    },

    // Reference to Hostel (for grouping & admin stats)
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelSetup",
      required: true,
    },

    // Attendance date (normalized to start of day)
    date: {
      type: Date,
      required: true,
    },

    // Attendance status
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },

    // Admin who marked attendance
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/**
 * Prevent duplicate attendance for same student on same day
 */
attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
