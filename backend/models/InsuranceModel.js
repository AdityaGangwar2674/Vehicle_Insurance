const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  policyNumber: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
  coverageAmount: {
    type: Number,
    required: true,
  },
  premium: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "Cancelled"],
    default: "Active",
  },
});

const Insurance = mongoose.model("Insurance", insuranceSchema);
module.exports = Insurance;
