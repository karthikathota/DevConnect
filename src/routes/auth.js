const express = require("express");
const app = express();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

app.use(express.json());
const authRouter = express.Router();

// Signup Route
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
      socialLinks,
      pinnedTopics,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        error:
          "Email already registered. Please use a different email or login.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
      socialLinks,
      pinnedTopics,
    });

    await user.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error:
          "Email already registered. Please use a different email or login.",
      });
    }
    res.status(400).json({ error: "An error occurred: " + err.message });
  }
});

// Login Route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const {
      firstName,
      lastName,
      emailId: email,
      photoUrl,
      age,
      gender,
      about,
      skills,
      socialLinks,
      pinnedTopics,
    } = user;

    res.status(200).json({
      message: "Login successful",
      user: {
        firstName,
        lastName,
        email,
        photoUrl,
        age,
        gender,
        about,
        skills,
        socialLinks,
        pinnedTopics,
      },
    });
  } catch (err) {
    res.status(400).json({ error: "Error occurred: " + err.message });
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "User Logged Out Successfully" });
});

module.exports = authRouter;
