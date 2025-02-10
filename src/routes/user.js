const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.send(connectionRequest);
  } catch (error) {
    res.send("Error Occured: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.send(data);
  } catch (error) {
    res.send("Error Occured: " + error.message);
  }
});
module.exports = userRouter;
