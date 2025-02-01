const express = require("express");
const app = express();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(express.json());

// Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = profileRouter;
