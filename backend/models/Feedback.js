const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegistration' },
  rating: { type: Number, min: 1, max: 5 },
  comments: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
