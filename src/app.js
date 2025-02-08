const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());

// User authentication routes
app.use("/", authRouter);

// User request routes
app.use("/", requestRouter);

// User profile routes
app.use("/", profileRouter);

// Users Routes
app.use("/", userRouter);
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
