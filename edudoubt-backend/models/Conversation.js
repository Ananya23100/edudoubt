const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  doubtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doubt",
    required: true
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  senderRole: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },

  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
