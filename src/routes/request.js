const express = require("express");
const app = express();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const ConnectionRequestModel = require("../models/connectionRequest");
require("dotenv").config();
app.use(express.json());

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignoring", "interested"];

      const toUser = await User.findById({ _id: toUserId });

      if (!toUser) {
        res.status(400).send("User not found");
      }

      if (!allowedStatus.includes(status)) {
        res.status(400).send("Status invalid");
      }

      // Checking if connection request is duplicate
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).send("Request already exists");
      }

      // Creating a connection request
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Allowed statuses for the connection request
      const allowedStatus = ["accepted", "rejected"];

      // Check if the status provided is valid
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      // Find the connection request in the database
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest) {
        return res.status(400).send("Cannot find request");
      }

      // Check if the request is already in the desired status
      if (connectionRequest.status === status) {
        return res.status(400).send(`Request is already ${status}`);
      }

      // Prevent changing from accepted to rejected or vice versa
      if (connectionRequest.status === "accepted" && status === "rejected") {
        return res
          .status(400)
          .send(
            "This request has already been accepted and cannot be rejected."
          );
      }

      if (connectionRequest.status === "rejected" && status === "accepted") {
        return res
          .status(400)
          .send(
            "This request has already been rejected and cannot be accepted."
          );
      }

      // Update the status of the request to accepted or rejected
      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: `Connection request ${status}`, data });
    } catch (err) {
      res.status(400).send("Error Occurred: " + err.message);
    }
  }
);

module.exports = requestRouter;
