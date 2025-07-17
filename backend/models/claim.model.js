const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    claimReason: {
      type: String,
      required: true,
    },
    claimAmount: {
      type: Number,
      required: true,
    },
    claimStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    claimDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", claimSchema);
