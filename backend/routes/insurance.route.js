const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  addInsurance,
  getMyInsurances,
  getAllInsurances,
  updateInsurance,
  deleteInsurance,
} = require("../controllers/insurance.controller");

router.post("/", protect, addInsurance); // Add insurance
router.get("/me", protect, getMyInsurances); // Customer's insurances
router.get("/", protect, adminOnly, getAllInsurances); // Admin access
router.put("/:id", protect, adminOnly, updateInsurance); // Admin access
router.delete("/:id", protect, adminOnly, deleteInsurance); // Admin access

module.exports = router;
