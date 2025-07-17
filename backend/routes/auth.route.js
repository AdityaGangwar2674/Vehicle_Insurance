const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getAllUsers,
} = require("../controllers/auth.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
