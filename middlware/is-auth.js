const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      next(error);
      return;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;

    decodedToken = jwt.verify(token, "somesupersecretsecret");

    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      next(error);
      return;
    }
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      const error = new Error("User Not Found.");
      error.statusCode = 401;
      next(error);
      return;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    err.statusCode = 500;
    next(error);
    return;
  }
};
