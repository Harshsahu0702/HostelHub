const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration', required: true },
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
