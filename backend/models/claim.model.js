const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Insurance",
    required: true,
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  amountClaimed: {
    type: Number,
    required: true,
  },
});

const Claim = mongoose.model("Claim", claimSchema);
module.exports = Claim;
