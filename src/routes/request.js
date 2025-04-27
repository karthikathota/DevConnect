const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

// Send a connection request
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
        return res.status(400).send("User not found");
      }

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Status invalid");
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Request already exists");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      return res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      return res.status(500).send("Error occurred: " + err.message);
    }
  }
);

// Review a connection request (accept or reject)
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest) {
        return res.status(400).send("Cannot find request");
      }

      if (connectionRequest.status === status) {
        return res.status(400).send(`Request is already ${status}`);
      }

      if (connectionRequest.status === "accepted" && status === "rejected") {
        return res
          .status(400)
          .send("This request has already been accepted and cannot be rejected.");
      }

      if (connectionRequest.status === "rejected" && status === "accepted") {
        return res
          .status(400)
          .send("This request has already been rejected and cannot be accepted.");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      return res.json({ message: `Connection request ${status}`, data });
    } catch (err) {
      return res.status(500).send("Error occurred: " + err.message);
    }
  }
);

module.exports = requestRouter;
