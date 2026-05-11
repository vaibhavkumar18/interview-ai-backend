const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @desc Register a new user , expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    if (isUserAlreadyExists.username === username) {
      return res.status(400).json({ message: "Username already exists" });
    }

    return res.status(400).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: passwordHash,
  });
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @desc Login a user , expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;
  console.log("email", email, "password", password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });
  console.log("user", user);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("isPasswordValid", isPasswordValid);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
  console.log("token", token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @route GET /api/auth/logout
 * @desc Logout a user by adding the token to blacklist, expects token in the request header
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (token) {
    await tokenBlacklistModel.create({ token });
  }
  res.clearCookie("token");
  return res.status(200).json({ message: "User logged out successfully" });
}

/**
 * @name Get Me Controller
 * @route GET /api/auth/get-me
 * @desc Get the current logged in user details, expects token in the request header
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
