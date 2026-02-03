const express = require("express");
const Doubt = require("../models/Doubt");
const User = require("../models/User");
const { analyzeDoubt } = require("../utils/aiAgent");
const mongoose = require("mongoose");


const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { studentId, question, courseCode } = req.body;

    if (!studentId || !question || !courseCode) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Step 1: AI analyzes doubt
    const { aiAnswer, confidence } = analyzeDoubt(question);

    let status = "ai_solved";
    let assignedTeacherId = null;

    // Step 2: Decision making (AGENTIC CORE)
    if (confidence < 0.7) {
      status = "assigned_to_teacher";

      // Find teacher with matching course code
      const teacher = await User.findOne({
        role: "teacher",
        courseCodes: courseCode
      });

      if (teacher) {
        assignedTeacherId = teacher._id;
      }
    }

    // Step 3: Save doubt
    const doubt = new Doubt({
      studentId,
      question,
      courseCode,
      aiAnswer,
      confidence,
      status,
      assignedTeacherId
    });

    await doubt.save();

    res.status(201).json({
      message: "Doubt processed",
      status,
      confidence
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * GET ALL DOUBTS OF A STUDENT
 */
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const doubts = await Doubt.find({ studentId })
      .sort({ createdAt: -1 }); // latest first

    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET DOUBTS ASSIGNED TO A TEACHER
 */
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Get ALL doubts assigned to this teacher, regardless of status
    // This ensures teacher can continue discussions even after marking as resolved
    const doubts = await Doubt.find({
      assignedTeacherId: new mongoose.Types.ObjectId(teacherId)
    })
    .sort({ updatedAt: -1, createdAt: -1 }); // Most recently updated first

    res.json(doubts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * TEACHER RESOLVES A DOUBT
 */
router.post("/resolve", async (req, res) => {
  try {
    const { doubtId, teacherAnswer } = req.body;

    await Doubt.findByIdAndUpdate(doubtId, {
      status: "resolved",
      aiAnswer: teacherAnswer
    });

    res.json({ message: "Doubt resolved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * TEACHER ENDS DISCUSSION
 */
router.post("/:doubtId/end-discussion", async (req, res) => {
  try {
    const { doubtId } = req.params;

    await Doubt.findByIdAndUpdate(doubtId, {
      discussionEnded: true,
      discussionEndedAt: new Date()
    });

    res.json({ message: "Discussion ended" });
  } catch (err) {
    console.error("Error ending discussion:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET SINGLE DOUBT BY ID
 */
router.get("/:doubtId", async (req, res) => {
  try {
    const { doubtId } = req.params;

    const doubt = await Doubt.findById(doubtId)
      .populate('studentId', 'name email')
      .populate('assignedTeacherId', 'name email');

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
