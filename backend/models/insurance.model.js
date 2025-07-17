const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    insuranceType: {
      type: String,
      enum: ["comprehensive", "third-party", "own damage", "personal accident"],
      required: true,
    },
    insuranceProvider: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      unique: true,
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
    premiumAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);
