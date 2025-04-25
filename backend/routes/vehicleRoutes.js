const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
} = require("../controllers/vehicleController");
const authenticate = require("../utils/authenticate");

router.post("/newvehicle", authenticate, createVehicle);
router.get("/allvehicles", authenticate, getAllVehicles);

module.exports = router;
