const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6681/6681204.png",
    },
    about: {
      type: String,
      default: "This is a default bio of user",
    },
    skills: {
      type: [String],
    },
    socialLinks: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@connect");
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const userHashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    userHashedPassword
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
