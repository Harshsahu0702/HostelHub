const mongoose = require('mongoose');

const AntiRaggingSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration' },
  studentName: { type: String },
  reporterName: String,
  reporterContact: String,
  details: String,
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AntiRaggingReport', AntiRaggingSchema);
