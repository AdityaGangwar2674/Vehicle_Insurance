const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  logoutUser,
  getCurrentUser,
} = require("../controllers/authController");

const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/users", authenticate, getAllUsers);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
