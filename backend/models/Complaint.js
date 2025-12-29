const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration', required: true },
  studentName: { type: String },
  subject: String,
  description: String,
  status: { type: String, enum: ['Pending','In Progress','Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
