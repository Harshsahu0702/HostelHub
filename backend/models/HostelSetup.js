const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomNumber: String,
  buildingId: Number,
  buildingName: String,
  floor: Number,
  type: String,
  capacity: Number,
  occupiedCount: { type: Number, default: 0 },
  occupied: { type: Boolean, default: false },
  active: Boolean,
});

const HostelSetupSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["DRAFT", "COMPLETED"],
      default: "DRAFT",
    },

    currentStep: {
      type: Number,
      default: 1,
    },

    // STEP 1: Basic Info
    hostelName: String,
    hostelAddress: String,
    hostelContact: String,
    hostelEmail: String,
    hostelType: String,

    // STEP 2: Admin Auth
    adminName: String,
    adminEmail: String,
    adminPassword: String,

    // STEP 3: Buildings
    buildings: [
      {
        id: Number,
        name: String,
        floors: Number,
        roomsPerFloor: Number,
      },
    ],

    // STEP 4: Room Matrix
    generatedRooms: [RoomSchema],

    // STEP 5: Mess (ONLY THIS)
    messAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HostelSetup", HostelSetupSchema);