const Payment = require("../models/payment.model");
const Customer = require("../models/customer.model");
const Insurance = require("../models/insurance.model");
const mongoose = require("mongoose");
const Receipt = require("../models/receipt.model");
const apiResponse = require("../utils/apiResponse");

const generateTransactionId = () => {
  return "TXN" + Math.floor(100000000 + Math.random() * 900000000).toString();
};

const generateReceiptNumber = () =>
  `RCT${Math.floor(100000 + Math.random() * 900000)}`;

exports.addPayment = async (req, res) => {
  try {
    const { insuranceId, amountPaid, paymentMode } = req.body;

    if (!insuranceId || !amountPaid || !paymentMode) {
      return apiResponse(res, false, "All fields are required", {}, 400);
    }

    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const insurance = await Insurance.findById(insuranceId);
    if (!insurance) {
      return apiResponse(res, false, "Insurance policy not found", {}, 404);
    }

    const transactionId = generateTransactionId();
    const newPayment = await Payment.create({
      customerId: customer._id,
      insuranceId,
      amountPaid,
      paymentMode,
      transactionId,
    });

    await Insurance.findByIdAndUpdate(insuranceId, { status: "active" });

    const receipt = await Receipt.create({
      customerId: customer._id,
      paymentId: newPayment._id,
      receiptNumber: generateReceiptNumber(),
    });

    return apiResponse(
      res,
      true,
      "Payment successful. Insurance is now active and receipt generated.",
      { payment: newPayment, receipt },
      201
    );
  } catch (error) {
    return apiResponse(res, false, "Error processing payment", { error: error.message }, 500);
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });

    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const payments = await Payment.find({ customerId: customer._id }).populate("insuranceId");
    return apiResponse(res, true, "Payments fetched successfully", payments, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching payments", { error: err.message }, 500);
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("customerId").populate("insuranceId");
    return apiResponse(res, true, "All payments fetched successfully", payments, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching payments", { error: err.message }, 500);
  }
};
