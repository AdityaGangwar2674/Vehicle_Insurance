const Customer = require("../models/customer.model");
const User = require("../models/user.model");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body;

    const existing = await Customer.findOne({ userId: req.user._id });

    const user = await User.findById(req.user._id);

    const data = {
      userId: req.user._id,
      name: user.name,
      email: user.email,
      phone,
      address,
    };

    let customer;
    if (existing) {
      customer = await Customer.findOneAndUpdate(
        { userId: req.user._id },
        data,
        { new: true }
      );
    } else {
      customer = await Customer.create(data);
    }

    res.status(200).json({ message: "Customer profile saved", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving profile", error: err.message });
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
