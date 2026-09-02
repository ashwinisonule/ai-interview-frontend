const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

require("dotenv").config();

// MongoDB SRV DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ==================================================
// ROUTES
// ==================================================

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resultRoutes = require("./routes/resultRoutes");

// ==================================================
// APP
// ==================================================

const app = express();

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());

// ==================================================
// TEST
// ==================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Backend is running"
  });
});

// ==================================================
// AUTH
// ==================================================

app.use("/api/auth", authRoutes);

// ==================================================
// INTERVIEWS
// ==================================================

app.use("/api/interviews", interviewRoutes);

// ==================================================
// RESULTS
// ==================================================

app.use("/api/results", resultRoutes);

// ==================================================
// DATABASE
// ==================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});