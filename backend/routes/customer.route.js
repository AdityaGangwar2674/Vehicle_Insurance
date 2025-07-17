const express = require("express");
const router = express.Router();
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllCustomers,
} = require("../controllers/customer.controller");

const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, createOrUpdateProfile);
router.get("/me", protect, getMyProfile);
router.get("/", protect, adminOnly, getAllCustomers);

module.exports = router;
