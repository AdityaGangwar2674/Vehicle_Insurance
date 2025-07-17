const Payment = require("../models/payment.model");
const Customer = require("../models/customer.model");
const Insurance = require("../models/insurance.model");
const mongoose = require("mongoose");

const generateTransactionId = () => {
  return "TXN" + Math.floor(100000000 + Math.random() * 900000000).toString();
};

exports.addPayment = async (req, res) => {
  try {
    const { customerId, insuranceId, amountPaid, paymentMode } = req.body;

    if (!customerId || !insuranceId || !amountPaid || !paymentMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: Validate customer & insurance exist
    const customer = await Customer.findById(customerId);
    const insurance = await Insurance.findById(insuranceId);

    if (!customer || !insurance) {
      return res
        .status(404)
        .json({ message: "Customer or Insurance not found" });
    }

    const transactionId = generateTransactionId();

    const newPayment = new Payment({
      customerId,
      insuranceId,
      amountPaid,
      paymentMode,
      transactionId,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      message: "Payment added",
      payment: savedPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding payment",
      error: error.message,
    });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    console.log("🔐 Logged-in user:", req.user);

    const userId = req.user._id;
    const customer = await Customer.findOne({ userId });

    if (!customer) {
      console.log("⚠️ No customer profile found for user", userId);
      return res.status(404).json({ message: "Customer profile not found." });
    }

    console.log("✅ Found customerId:", customer._id);

    const payments = await Payment.find({ customerId: customer._id }).populate(
      "insuranceId"
    );
    console.log(`✅ Found ${payments.length} payments`);

    res.status(200).json(payments);
  } catch (err) {
    console.error("❌ Error in getMyPayments:", err);
    res
      .status(500)
      .json({ message: "Error fetching payments", error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customerId")
      .populate("insuranceId");

    res.status(200).json(payments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: err.message });
  }
};
