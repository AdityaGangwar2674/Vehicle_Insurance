const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
    unique: true, // One receipt per payment
  },
  receiptNumber: {
    type: String,
    unique: true,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Receipt", receiptSchema);
