const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  addPayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/payment.controller");

router.post("/", protect, addPayment); // Customer adds a payment
router.get("/me", protect, getMyPayments); // Customer views their payments
router.get("/", protect, adminOnly, getAllPayments); // Admin views all

module.exports = router;
