const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");

const {
  makePayment,
  getAllPayments,
  getPaymentById,
} = require("../controllers/paymentController");

router.post("/makepayment", authenticate, makePayment);
router.get(
  "/allpayments",
  authenticate,
  authorizeRole("admin"),
  getAllPayments
);
router.get("/:id", authenticate, getPaymentById);

module.exports = router;
