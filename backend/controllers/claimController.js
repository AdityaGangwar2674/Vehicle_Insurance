const Claim = require("../models/ClaimModel");
const Insurance = require("../models/InsuranceModel");

const createClaim = async (req, res) => {
  const { insurance, incidentDate, description, amountClaimed } = req.body;

  try {
    const insurancePolicy = await Insurance.findById(insurance);
    if (!insurancePolicy) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found.",
      });
    }
    const newClaim = await Claim.create({
      insurance,
      incidentDate,
      description,
      amountClaimed,
    });

    res.status(201).json({
      success: true,
      data: newClaim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating claim.",
      error: error.message,
    });
  }
};

const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find({}).populate("insurance");
    res.status(200).json({
      success: true,
      data: claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching claims.",
    });
  }
};

const updateClaimStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const claim = await Claim.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update claim status.",
    });
  }
};

module.exports = {
  createClaim,
  getAllClaims,
  updateClaimStatus,
};
