const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");
const upload = require("../middlewares/multer.config");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

const { addVehicle, getMyVehicles, getAllVehicles } = vehicleController;

router.post("/add", protect, upload.single("image"), addVehicle);
router.get("/me", protect, getMyVehicles);
router.get("/", protect, adminOnly, getAllVehicles);

module.exports = router;
