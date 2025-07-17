const express = require("express");
const router = express.Router();
const {
  createProfile,
  updateProfile,
  getMyProfile,
  getAllCustomers,
} = require("../controllers/customer.controller");

const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, createProfile);
router.put("/", protect, updateProfile);
router.get("/me", protect, getMyProfile);
router.get("/", protect, adminOnly, getAllCustomers);

module.exports = router;
