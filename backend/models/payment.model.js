const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  insuranceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Insurance",
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "Card", "UPI", "Net Banking"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
