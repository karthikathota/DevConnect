const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validator = require("validator");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

// Importing Routes
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

// Using routessssss

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

// If multiple people with same mail return only one
app.get("/user/findOne", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(err.message);
  }
});

// Returns users matching the inbound email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(err.message);
  }
});

// Get all existing users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.send(err.message);
  }
});

// Delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOneAndDelete({ userId });
    if (user) {
      res.send("User deleted succesfully");
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.send(err.message);
  }
});

// Update data of user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const Allowed_Updates = ["photoUrl", "about", "gender", "age", "skills"];

  // First validation: Check if all the keys in the request body are allowed
  const isUpdateAllowed = Object.keys(data).every((k) =>
    Allowed_Updates.includes(k)
  );

  if (!isUpdateAllowed) {
    return res.status(400).send("Update Not Allowed.");
  }
  if (data.skills.length > 10) {
    return res.status(400).send("Skills cannot be more than 10");
  }

  try {
    // Attempt to find and update the user
    const user = await User.findOneAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    if (user) {
      return res.send("User updated successfully");
    } else {
      // If user is not found
      return res.status(404).send("User not found");
    }
  } catch (err) {
    // Handle errors during the update operation
    return res.status(400).send(err.message);
  }
});

// Connecting to DB
connectDB()
  .then(() => {
    console.log("Successfully connected to db");
    // Only connecting to server when DB connection is established.
    app.listen(7777, () => {
      console.log("Listening to 7777");
    });
  })
  .catch((err) => {
    console.log("DB cannot be connected");
  });
