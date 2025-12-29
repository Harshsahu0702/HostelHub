const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    // Hostel scope (VERY IMPORTANT)
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelSetup",
      required: true,
      index: true,
    },

    // Message type
    chatType: {
      type: String,
      enum: ["personal", "group"],
      required: true,
    },

    // Sender info
    senderType: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderTypeModel",
    },

    // Receiver info (ONLY for personal chat)
    receiverType: {
      type: String,
      enum: ["student", "admin"],
      default: null,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      refPath: "receiverTypeModel",
    },

    // Message content
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* 🔁 Dynamic refs */
ChatMessageSchema.virtual("senderTypeModel").get(function () {
  return this.senderType === "student"
    ? "StudentRegistration"
    : "Admin";
});

ChatMessageSchema.virtual("receiverTypeModel").get(function () {
  if (!this.receiverType) return null;
  return this.receiverType === "student"
    ? "StudentRegistration"
    : "Admin";
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
