const Insurance = require("../models/insurance.model");
const Customer = require("../models/customer.model");
const apiResponse = require("../utils/apiResponse");

// Add new insurance
exports.addInsurance = async (req, res) => {
  try {
    let customerId;

    if (req.user.role === "admin" && req.body.customerId) {
      customerId = req.body.customerId;
    } else {
      const customer = await Customer.findOne({ userId: req.user._id });
      if (!customer) {
        return apiResponse(res, false, "Customer profile not found", {}, 404);
      }
      customerId = customer._id;
    }

    const {
      vehicleId,
      insuranceType,
      insuranceProvider,
      policyNumber,
      startDate,
      endDate,
      premiumAmount,
    } = req.body;

    const exists = await Insurance.findOne({ policyNumber });
    if (exists) {
      return apiResponse(res, false, "Policy with this number already exists", {}, 400);
    }

    const insurance = await Insurance.create({
      customerId,
      vehicleId,
      insuranceType,
      insuranceProvider,
      policyNumber,
      startDate,
      endDate,
      premiumAmount,
    });

    return apiResponse(res, true, "Insurance policy created successfully", insurance, 201);
  } catch (err) {
    return apiResponse(res, false, "Error creating insurance", { error: err.message }, 500);
  }
};

// Get all insurances of current customer
exports.getMyInsurances = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const insurances = await Insurance.find({ customerId: customer._id }).populate("vehicleId");
    return apiResponse(res, true, "Your insurance policies fetched successfully", insurances, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching your insurances", { error: err.message }, 500);
  }
};

// Admin: Get all insurances
exports.getAllInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find().populate("vehicleId").populate("customerId");
    return apiResponse(res, true, "All insurance policies fetched successfully", insurances, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching all insurances", { error: err.message }, 500);
  }
};

// Admin: Update insurance by ID
exports.updateInsurance = async (req, res) => {
  try {
    const insuranceId = req.params.id;
    const updateData = req.body;

    const updated = await Insurance.findByIdAndUpdate(insuranceId, updateData, { new: true });
    if (!updated) {
      return apiResponse(res, false, "Insurance policy not found", {}, 404);
    }

    return apiResponse(res, true, "Insurance policy updated successfully", updated, 200);
  } catch (err) {
    return apiResponse(res, false, "Error updating insurance", { error: err.message }, 500);
  }
};

// Admin: Delete insurance by ID
exports.deleteInsurance = async (req, res) => {
  try {
    const insuranceId = req.params.id;

    const deleted = await Insurance.findByIdAndDelete(insuranceId);
    if (!deleted) {
      return apiResponse(res, false, "Insurance policy not found", {}, 404);
    }

    return apiResponse(res, true, "Insurance policy deleted successfully", {}, 200);
  } catch (err) {
    return apiResponse(res, false, "Error deleting insurance", { error: err.message }, 500);
  }
};
