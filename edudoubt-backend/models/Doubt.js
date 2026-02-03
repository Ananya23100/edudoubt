const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  question: {
    type: String,
    required: true
  },

  courseCode: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["submitted", "ai_solved", "assigned_to_teacher", "resolved"],
    default: "submitted"
  },

  aiAnswer: {
    type: String,
    default: ""
  },

  confidence: {
    type: Number,
    default: 0
  },

  assignedTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  discussionEnded: {
    type: Boolean,
    default: false
  },

  discussionEndedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("Doubt", doubtSchema);
