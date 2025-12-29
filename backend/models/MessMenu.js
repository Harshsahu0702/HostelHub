const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  day: String,
  breakfast: String,
  lunch: String,
  dinner: String
});

const MessMenuSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelSetup' },
  weekStart: Date,
  items: [MenuItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MessMenu', MessMenuSchema);
