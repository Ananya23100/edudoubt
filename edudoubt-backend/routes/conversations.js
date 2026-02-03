const express = require("express");
const Conversation = require("../models/Conversation");
const Doubt = require("../models/Doubt");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * GET conversation (student OR assigned teacher)
 */
router.get("/:doubtId/:userId", async (req, res) => {
  try {
    const { doubtId, userId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    const uid = new mongoose.Types.ObjectId(userId);

    // Allow access if: student who asked OR teacher assigned to this doubt
    if (
      !doubt.studentId.equals(uid) &&
      (!doubt.assignedTeacherId ||
        !doubt.assignedTeacherId.equals(uid))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all messages for this doubt, sorted by creation time
    const messages = await Conversation.find({ doubtId })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST new message
 */
router.post("/", async (req, res) => {
  try {
    const { doubtId, senderId, senderRole, message } = req.body;

    if (!doubtId || !senderId || !senderRole || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const msg = new Conversation({
      doubtId,
      senderId,
      senderRole,
      message
    });

    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
