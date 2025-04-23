const express = require("express");
const app = express();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const {
  validateEditProfile,
  validateSignUpData,
} = require("../utils/validation");
require("dotenv").config();

app.use(express.json());

// Profile View
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: "Profile fetched successfully", data: user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Cannot update some of the fields");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({ error: "Error occurred: " + error.message });
  }
});

// Forgot Password
profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    const loggedInUser = req.user;

    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your password was updated successfully`,
    });
  } catch (error) {
    res.status(400).json({ error: "Error occurred: " + error.message });
  }
});

module.exports = profileRouter;
