const Claim = require("../models/claim.model");
const Customer = require("../models/customer.model");
const { getFullImageUrl } = require("../utils/url.helper");
const Insurance = require("../models/insurance.model");
const apiResponse = require("../utils/apiResponse");

// Add new claim
exports.addClaim = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const { insuranceId, claimReason, claimAmount } = req.body;

    // Workflow Validation: Check if insurance is active before allowing claim
    const insurance = await Insurance.findById(insuranceId);
    if (!insurance) {
      return apiResponse(res, false, "Insurance record not found", {}, 404);
    }

    if (insurance.status !== "active") {
      return apiResponse(
        res,
        false,
        "Claims can only be filed against active insurance policies.",
        { currentStatus: insurance.status },
        400
      );
    }

    // Unify Image Handling: Prefer relative path for portability
    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

    const claim = await Claim.create({
      insuranceId,
      customerId: customer._id,
      claimReason,
      claimAmount,
      accidentImage: imagePath,
    });

    // Add full URL to response for immediate UI update
    const claimResponse = claim.toObject();
    if (claimResponse.accidentImage) {
      claimResponse.accidentImage = getFullImageUrl(req, claimResponse.accidentImage);
    }

    return apiResponse(res, true, "Claim submitted successfully and is pending review.", claimResponse, 201);
  } catch (err) {
    return apiResponse(res, false, "Error submitting claim", { error: err.message }, 500);
  }
};

// Get all claims of the logged-in customer
exports.getMyClaims = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const claims = await Claim.find({ customerId: customer._id }).populate("insuranceId");

    const claimsWithFullUrl = claims.map((c) => {
      const claimObj = c.toObject();
      if (claimObj.accidentImage) {
        claimObj.accidentImage = getFullImageUrl(req, claimObj.accidentImage);
      }
      return claimObj;
    });

    return apiResponse(res, true, "Your claims fetched successfully", claimsWithFullUrl, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching your claims", { error: err.message }, 500);
  }
};

// Admin: Get all claims
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate("customerId").populate("insuranceId");

    const claimsWithFullUrl = claims.map((c) => {
      const claimObj = c.toObject();
      if (claimObj.accidentImage) {
        claimObj.accidentImage = getFullImageUrl(req, claimObj.accidentImage);
      }
      return claimObj;
    });

    return apiResponse(res, true, "All claims fetched successfully", claimsWithFullUrl, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching claims", { error: err.message }, 500);
  }
};

// Admin: Update claim status
exports.updateClaimStatus = async (req, res) => {
  try {
    const claimId = req.params.id;
    const { claimStatus } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(claimStatus)) {
      return apiResponse(res, false, "Invalid claim status", { allowed: ["Pending", "Approved", "Rejected"] }, 400);
    }

    const currentClaim = await Claim.findById(claimId);
    if (!currentClaim) {
      return apiResponse(res, false, "Claim not found", {}, 404);
    }

    // Logic: If claim is moving from Pending -> Approved, deduct from policy's remainingBenefit
    if (claimStatus === "Approved" && currentClaim.claimStatus === "Pending") {
      const insurance = await Insurance.findById(currentClaim.insuranceId);
      if (insurance) {
        insurance.remainingBenefit = Math.max(0, insurance.remainingBenefit - currentClaim.claimAmount);
        await insurance.save();
      }
    }

    currentClaim.claimStatus = claimStatus;
    const updated = await currentClaim.save();
    const updatedClaim = updated.toObject();

    if (updatedClaim.accidentImage) {
      updatedClaim.accidentImage = getFullImageUrl(req, updatedClaim.accidentImage);
    }

    return apiResponse(res, true, "Claim status updated successfully", updatedClaim, 200);
  } catch (err) {
    return apiResponse(res, false, "Error updating claim", { error: err.message }, 500);
  }
};
