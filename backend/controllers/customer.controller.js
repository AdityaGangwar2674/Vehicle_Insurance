const Customer = require("../models/customer.model");
const User = require("../models/user.model");
const apiResponse = require("../utils/apiResponse");

exports.createProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;
    const existing = await Customer.findOne({ userId: req.user._id });
    if (existing) {
      return apiResponse(res, false, "Profile already exists", {}, 400);
    }

    const user = req.user;
    const customer = await Customer.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone,
      address,
    });

    return apiResponse(res, true, "Customer profile created successfully", customer, 201);
  } catch (err) {
    return apiResponse(res, false, "Error creating profile", { error: err.message }, 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;
    const user = req.user;

    const customer = await Customer.findOneAndUpdate(
      { userId: user._id },
      {
        name: user.name,
        email: user.email,
        phone,
        address,
      },
      { new: true }
    );

    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    return apiResponse(res, true, "Profile updated successfully", customer, 200);
  } catch (err) {
    return apiResponse(res, false, "Error updating profile", { error: err.message }, 500);
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Profile not found", {}, 404);
    }
    return apiResponse(res, true, "Profile fetched successfully", customer, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching profile", { error: err.message }, 500);
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("userId", "name email role");
    return apiResponse(res, true, "Customers fetched successfully", customers, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching customers", { error: err.message }, 500);
  }
};
