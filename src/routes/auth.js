const express = require("express");
const app = express();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(express.json());

const authRouter = express.Router();

// Creating a new user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate SignUp Data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt Password
    const passwordHash = await bcrypt.hash(password, 10);
    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("An error occured:" + err.message);
  }
});

// User Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send("User does not exist");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Creating JWT Token

      const token = await user.getJWT();
      //  console.log(token);

      // Setting the Token in Cookie

      res.cookie("token", token);
      return res.status(200).send("User login successfull");
    } else {
      res.status(400).send("Invalid Password");
    }
  } catch (err) {
    res.status(400).send("Error Occured" + err.message);
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User Logged Out Succesfully");
});

module.exports = authRouter;
