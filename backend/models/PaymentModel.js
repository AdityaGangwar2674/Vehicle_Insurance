const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Insurance",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "NetBanking", "UPI"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Success", "Failed", "Pending"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
