const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
} = require("../controllers/vehicleController");
const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");

router.post("/newvehicle", authenticate, createVehicle);
router.get(
  "/allvehicles",
  authenticate,
  authorizeRole("admin"),
  getAllVehicles
);

module.exports = router;
