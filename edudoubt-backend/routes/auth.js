const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, courseCodes } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields required" });

    if (role === "teacher" && (!courseCodes || courseCodes.length === 0))
      return res.status(400).json({ message: "Teacher must have course codes" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      courseCodes: role === "teacher" ? courseCodes : []
    });

    await user.save();

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      userId: user._id,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
