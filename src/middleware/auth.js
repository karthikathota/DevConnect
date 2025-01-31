const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
User;
const userAuth = async (req, res, next) => {
  try {
    // Getting the token from cookies
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    // Verify token
    const decodedObj = await jwt.verify(token, "Dev@connect");

    const { _id } = decodedObj;
    const userFound = await User.findById(_id);

    if (!userFound) {
      throw new Error("User not found");
    }

    // Attach user to the request object
    req.user = userFound;
    next(); // Continue to the route handler
  } catch (err) {
    console.error("Authentication error:", err); // Log the error
    res.status(400).send(err.message); // Send error response to the client
  }
};

module.exports = {
  userAuth,
};
