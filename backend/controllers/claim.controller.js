const Claim = require("../models/claim.model");
const Customer = require("../models/customer.model");
const { getFullImageUrl } = require("../utils/url.helper");

// Add new claim
exports.addClaim = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const { insuranceId, claimReason, claimAmount } = req.body;

    const claimData = {
      insuranceId,
      customerId: customer._id,
      claimReason,
      claimAmount,
    };

    if (req.file) {
      claimData.accidentImage = req.file.path; // multer stores path
    }

    const claim = await Claim.create(claimData);

    // Add full URL to accidentImage
    const claimResponse = claim.toObject();
    if (claimResponse.accidentImage) {
      claimResponse.accidentImage = getFullImageUrl(
        req,
        claimResponse.accidentImage
      );
    }

    res
      .status(201)
      .json({ message: "Claim submitted successfully", claim: claimResponse });
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

    const claimsWithFullUrl = claims.map((c) => {
      const claimObj = c.toObject();
      if (claimObj.accidentImage) {
        claimObj.accidentImage = getFullImageUrl(req, claimObj.accidentImage);
      }
      return claimObj;
    });

    res.status(200).json(claimsWithFullUrl);
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

    const claimsWithFullUrl = claims.map((c) => {
      const claimObj = c.toObject();
      if (claimObj.accidentImage) {
        claimObj.accidentImage = getFullImageUrl(req, claimObj.accidentImage);
      }
      return claimObj;
    });

    res.status(200).json(claimsWithFullUrl);
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

    const updatedClaim = updated.toObject();
    if (updatedClaim.accidentImage) {
      updatedClaim.accidentImage = getFullImageUrl(
        req,
        updatedClaim.accidentImage
      );
    }

    res
      .status(200)
      .json({ message: "Claim status updated", claim: updatedClaim });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating claim", error: err.message });
  }
};
