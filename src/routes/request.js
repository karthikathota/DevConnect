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

      console.log(fromUserId);
      console.log(toUserId);
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Succesfully sent connection request",
        data,
      });
    } catch (err) {
      res.send(err.messafe);
    }
  }
);

module.exports = requestRouter;
