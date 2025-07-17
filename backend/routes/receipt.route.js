const express = require("express");
const router = express.Router();
const {
  generateReceipt,
  getMyReceipts,
  getAllReceipts,
} = require("../controllers/receipt.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, generateReceipt); // Generate receipt
router.get("/me", protect, getMyReceipts); // Customer receipts
router.get("/", protect, adminOnly, getAllReceipts); // Admin only

module.exports = router;
