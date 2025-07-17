const Claim = require("../models/claim.model");
const Customer = require("../models/customer.model");

// Add new claim
exports.addClaim = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const { insuranceId, claimReason, claimAmount } = req.body;

    const claim = await Claim.create({
      insuranceId,
      customerId: customer._id,
      claimReason,
      claimAmount,
    });

    res.status(201).json({ message: "Claim submitted successfully", claim });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting claim", error: err.message });
  }
};

// Get all claims of the logged-in customer
exports.getMyClaims = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });

    const claims = await Claim.find({ customerId: customer._id }).populate(
      "insuranceId"
    );

    res.status(200).json(claims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching your claims", error: err.message });
  }
};

// Admin: Get all claims
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("customerId")
      .populate("insuranceId");

    res.status(200).json(claims);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching claims", error: err.message });
  }
};

// Admin: Update claim status
exports.updateClaimStatus = async (req, res) => {
  try {
    const claimId = req.params.id;
    const { claimStatus } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(claimStatus))
      return res.status(400).json({ message: "Invalid claim status" });

    const updated = await Claim.findByIdAndUpdate(
      claimId,
      { claimStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Claim not found" });

    res.status(200).json({ message: "Claim status updated", claim: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating claim", error: err.message });
  }
};
