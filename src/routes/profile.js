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
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Profile Edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Cannot update some of the feilds");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send(`${loggedInUser.firstName}, your profile was updated succesfully`);
  } catch (error) {
    res.status(400).send("Error Ocuured: " + error.message);
  }
});

// Forgot Password
profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Check if current password exists and if it's correct
    const loggedInUser = req.user;

    // Use the existing validatePassword method from your schema
    // const isMatch = await loggedInUser.validatePassword(currentPassword);
    // if (!isMatch) {
    //   throw new Error("Current password is incorrect");
    // }

    // Hash the new password before saving (assuming bcrypt)
    loggedInUser.password = await bcrypt.hash(newPassword, 10);

    await loggedInUser.save();

    res.send(
      `${loggedInUser.firstName}, your password was updated successfully`
    );
  } catch (error) {
    res.status(400).send("Error occurred: " + error.message);
  }
});

module.exports = profileRouter;
