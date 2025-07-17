const Insurance = require("../models/insurance.model");
const Customer = require("../models/customer.model");

// Add new insurance
exports.addInsurance = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

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
    if (exists)
      return res.status(400).json({ message: "Policy already exists" });

    const insurance = await Insurance.create({
      customerId: customer._id,
      vehicleId,
      insuranceType,
      insuranceProvider,
      policyNumber,
      startDate,
      endDate,
      premiumAmount,
    });

    res
      .status(201)
      .json({ message: "Insurance added successfully", insurance });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding insurance", error: err.message });
  }
};

// Get all insurances of current customer
exports.getMyInsurances = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    const insurances = await Insurance.find({
      customerId: customer._id,
    }).populate("vehicleId");
    res.status(200).json(insurances);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching your insurances", error: err.message });
  }
};

// Admin: Get all insurances
exports.getAllInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find()
      .populate("vehicleId")
      .populate("customerId");
    res.status(200).json(insurances);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all insurances", error: err.message });
  }
};

// Admin: Update insurance by ID (from route param)
exports.updateInsurance = async (req, res) => {
  try {
    const insuranceId = req.params.id;
    const updateData = req.body;

    const updated = await Insurance.findByIdAndUpdate(insuranceId, updateData, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Insurance not found" });

    res.status(200).json({ message: "Insurance updated", insurance: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating insurance", error: err.message });
  }
};

// Admin: Delete insurance by ID (from route param)
exports.deleteInsurance = async (req, res) => {
  try {
    const insuranceId = req.params.id;

    const deleted = await Insurance.findByIdAndDelete(insuranceId);
    if (!deleted)
      return res.status(404).json({ message: "Insurance not found" });

    res.status(200).json({ message: "Insurance deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting insurance", error: err.message });
  }
};
