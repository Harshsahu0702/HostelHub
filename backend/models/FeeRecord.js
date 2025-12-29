const mongoose = require('mongoose');

const FeeRecordSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration', required: true },
  desc: String,
  date: Date,
  amount: Number,
  status: { type: String, enum: ['Paid','Due'], default: 'Due' },
  method: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeeRecord', FeeRecordSchema);
