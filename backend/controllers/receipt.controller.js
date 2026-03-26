const Receipt = require("../models/receipt.model");
const Customer = require("../models/customer.model");
const apiResponse = require("../utils/apiResponse");

const generateReceiptNumber = () =>
  `RCT${Math.floor(100000 + Math.random() * 900000)}`;

exports.generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const newReceipt = await Receipt.create({
      customerId: customer._id,
      paymentId,
      receiptNumber: generateReceiptNumber(),
    });

    return apiResponse(res, true, "Receipt generated successfully", newReceipt, 201);
  } catch (err) {
    return apiResponse(res, false, "Error generating receipt", { error: err.message }, 500);
  }
};

exports.getMyReceipts = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const receipts = await Receipt.find({ customerId: customer._id }).populate("paymentId");
    return apiResponse(res, true, "Your receipts fetched successfully", receipts, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching receipts", { error: err.message }, 500);
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().populate("customerId").populate("paymentId");
    return apiResponse(res, true, "All receipts fetched successfully", receipts, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching all receipts", { error: err.message }, 500);
  }
};
