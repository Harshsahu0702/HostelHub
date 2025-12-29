const mongoose = require('mongoose');

const DepartureSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration', required: true },
  fromDate: Date,
  toDate: Date,
  reason: String,
  status: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DepartureRequest', DepartureSchema);
