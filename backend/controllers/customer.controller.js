const Customer = require("../models/customer.model");
const User = require("../models/user.model");

exports.createProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;
    const existing = await Customer.findOne({ userId: req.user._id });
    if (existing)
      return res.status(400).json({ message: "Profile already exists" });

    const user = req.user;
    const customer = await Customer.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone,
      address,
    });

    res.status(201).json({ message: "Customer profile created", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating profile", error: err.message });
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

    if (!customer)
      return res.status(404).json({ message: "Customer profile not found" });

    res.status(200).json({ message: "Profile updated", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(customer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate(
      "userId",
      "name email role"
    );
    res.status(200).json(customers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: err.message });
  }
};
