const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const apiResponse = require("../utils/apiResponse");

// Register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiResponse(res, false, "User already exists", {}, 400);
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return apiResponse(
      res,
      true,
      "User registered successfully",
      { user: { name: user.name, email: user.email, role: user.role }, token },
      201
    );
  } catch (err) {
    return apiResponse(res, false, "Registration failed", { error: err.message }, 500);
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return apiResponse(res, false, "Invalid credentials", {}, 401);
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return apiResponse(
      res,
      true,
      "Login successful",
      { user: { name: user.name, email: user.email, role: user.role }, token },
      200
    );
  } catch (err) {
    return apiResponse(res, false, "Login failed", { error: err.message }, 500);
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  return apiResponse(res, true, "Logout successful", {}, 200);
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return apiResponse(res, true, "Users fetched successfully", users, 200);
  } catch (err) {
    return apiResponse(res, false, "Failed to fetch users", { error: err.message }, 500);
  }
};
