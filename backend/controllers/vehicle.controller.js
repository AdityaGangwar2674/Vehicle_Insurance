const Vehicle = require("../models/vehicle.model");
const Customer = require("../models/customer.model");

exports.addVehicle = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(400).json({ message: "Customer profile not found" });

    const { registrationNumber, brand, model, type, manufactureYear } =
      req.body;

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing)
      return res
        .status(400)
        .json({ message: "Vehicle with this registration already exists" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const vehicle = await Vehicle.create({
      customerId: customer._id,
      ownerName: customer.name,
      registrationNumber,
      brand,
      model,
      type,
      manufactureYear,
      image: imagePath,
    });

    res.status(201).json({ message: "Vehicle added successfully", vehicle });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding vehicle", error: err.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer profile not found" });

    const vehicles = await Vehicle.find({ customerId: customer._id });
    res.status(200).json(vehicles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching vehicles", error: err.message });
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("customerId");
    res.status(200).json(vehicles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all vehicles", error: err.message });
  }
};
