const jwt = require("jsonwebtoken");
const config = require("../config/config");
const tokenBlacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
  // Check if the token is blacklisted
  const isBlacklistedToken = await tokenBlacklistModel.findOne({ token });
  if (isBlacklistedToken) {
    return res.status(401).json({ message: "Token is Invalid" });
  }
  // Verify the token
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token, authorization denied" });
  }
}

module.exports = { authUserMiddleware };
