const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

/**
 * GET ALL COURSES
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
