const express = require("express");
const app = express();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
app.use(express.json());

const requestRouter = express.Router();

requestRouter.post("", userAuth, async (req, res) => {});

module.exports = requestRouter;
