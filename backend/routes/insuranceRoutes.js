const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");

const {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  deleteInsurance,
} = require("../controllers/insuranceController");

router.post("/newinsurance", authenticate, createInsurance);
router.get("/allinsurances", authenticate, getAllInsurance);
router.get("/:id", authenticate, getInsuranceById);
router.delete("/:id", authenticate, deleteInsurance);

module.exports = router;