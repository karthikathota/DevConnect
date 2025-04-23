const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("Enter Proper name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }
  // else if (!validator.isStrongPassword(password)) {
  //   throw new Error("Please enter a strong Password!");
  // }
};

const validateEditProfile = (req) => {
  const Allowed_Updates = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    "socialLinks", // ✅ Add this line
  ];

  const isEditAllowed = Object.keys(req.body).every((k) =>
    Allowed_Updates.includes(k)
  );

  return isEditAllowed;
};

module.exports = {
  validateEditProfile,
  validateSignUpData,
};
