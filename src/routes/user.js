const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("../models/connectionRequest");
const USER_SAFE_DATA =
  "firstName lastName emailId age gender photoUrl about skills socialLinks";

// Checking received requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "gender",
      "photoUrl",
      "age",
      "about",
      "skills",
    ]);
    res.send(connectionRequest);
  } catch (error) {
    res.send("Error Occured: " + error.message);
  }
});

// Checking all the users connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({ data });
  } catch (error) {
    res.send("Error Occured: " + error.message);
  }
});

// routes/user.js or wherever you handle user routes

userRouter.post("/user/search", async (req, res) => {
  const { email } = req.body;
  console.log(email)
  if (!email) return res.status(400).json({ error: "Email query is required" });

  try {
    const user = await User.find({ emailId:email }); // adjust based on your DB
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Populate user feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Finding all the connection requests of logged in user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUserFromFeed.add(connection.fromUserId);
      hideUserFromFeed.add(connection.toUserId);
    });
    // Getting all the users with not connections to logged in User
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);
    res.json({ users });
  } catch (error) {
    res.status(400).send("Error Occured: " + error.message);
  }
});
module.exports = userRouter;
