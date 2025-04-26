const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");

const {
  makePayment,
  getAllPayments,
  getPaymentById,
} = require("../controllers/paymentController");

router.post("/make", authenticate, makePayment);
router.get("/all", authenticate, getAllPayments);
router.get("/:id", authenticate, getPaymentById);

module.exports = router;
