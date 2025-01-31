const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      loswecase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // validate(value) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error("Enter stronger password");
      //   }
      // },
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
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fdefault-user&psig=AOvVaw28s2Z0T7IHVVOLWQCEhhQP&ust=1730960425544000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjki5yIx4kDFQAAAAAdAAAAABAJ",
    },
    about: {
      type: String,
      default: "This is a default bio of user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// User model created.
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
