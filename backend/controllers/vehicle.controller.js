const Vehicle = require("../models/vehicle.model");
const Customer = require("../models/customer.model");
const { getFullImageUrl } = require("../utils/url.helper");
const apiResponse = require("../utils/apiResponse");

exports.addVehicle = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const { registrationNumber, brand, model, type, manufactureYear } = req.body;

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing) {
      return apiResponse(res, false, "Vehicle with this registration already exists", {}, 400);
    }

    const imagePath = req.file ? `uploads/${req.file.filename}` : null;

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

    const vehicleResponse = vehicle.toObject();
    if (vehicleResponse.image) {
      vehicleResponse.image = getFullImageUrl(req, vehicleResponse.image);
    }

    return apiResponse(res, true, "Vehicle added successfully", vehicleResponse, 201);
  } catch (err) {
    return apiResponse(res, false, "Error adding vehicle", { error: err.message }, 500);
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) {
      return apiResponse(res, false, "Customer profile not found", {}, 404);
    }

    const vehicles = await Vehicle.find({ customerId: customer._id });

    const vehiclesWithFullUrl = vehicles.map((v) => {
      const vehicleObj = v.toObject();
      if (vehicleObj.image) {
        vehicleObj.image = getFullImageUrl(req, vehicleObj.image);
      }
      return vehicleObj;
    });

    return apiResponse(res, true, "Vehicles fetched successfully", vehiclesWithFullUrl, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching vehicles", { error: err.message }, 500);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("customerId");

    const vehiclesWithFullUrl = vehicles.map((v) => {
      const vehicleObj = v.toObject();
      if (vehicleObj.image) {
        vehicleObj.image = getFullImageUrl(req, vehicleObj.image);
      }
      return vehicleObj;
    });

    return apiResponse(res, true, "All vehicles fetched successfully", vehiclesWithFullUrl, 200);
  } catch (err) {
    return apiResponse(res, false, "Error fetching all vehicles", { error: err.message }, 500);
  }
};
