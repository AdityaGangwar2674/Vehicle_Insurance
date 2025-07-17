const Customer = require("../models/customer.model.js");
const Vehicle = require("../models/VehicleModel");

const createVehicle = async (req, res) => {
  const { ownerName, customer } = req.body;
  try {
    const customerData = await Customer.findById(customer);
    if (!customerData) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    if (customerData.name !== ownerName) {
      return res.status(400).json({
        success: false,
        message: "Owner name must match the customer's name",
      });
    }
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createVehicle, getAllVehicles };
