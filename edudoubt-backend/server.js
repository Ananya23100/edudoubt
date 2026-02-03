const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
const doubtRoutes = require("./routes/doubts");


app.use("/api/doubts", doubtRoutes);
const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);
const conversationRoutes = require("./routes/conversations");
app.use("/api/conversations", conversationRoutes);



// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
