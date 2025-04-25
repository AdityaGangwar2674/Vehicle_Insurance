const Insurance = require("../models/InsuranceModel");

const createInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.create(req.body);
    res.status(201).json({
      success: true,
      message: "Insurance policy created successfully",
      data: insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create insurance policy",
      error: error.message,
    });
  }
};

const getAllInsurance = async (req, res) => {
  try {
    const policies = await Insurance.find()
      .populate("customer", "name email")
      .populate("vehicle", "ownerName vehicleNumber model");
    res.status(200).json({
      success: true,
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getInsuranceById = async (req, res) => {
  try {
    const policy = await Insurance.findById(req.params.id)
      .populate("customer", "name email")
      .populate("vehicle", "ownerName vehicleNumber model");
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }
    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteInsurance = async (req, res) => {
  try {
    await Insurance.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Insurance policy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete insurance policy",
      error: error.message,
    });
  }
};

module.exports = {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  deleteInsurance,
};
