const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");

const {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  deleteInsurance,
} = require("../controllers/insuranceController");

router.post("/newinsurance", authenticate, createInsurance);
router.get(
  "/allinsurances",
  authenticate,
  authorizeRole("admin"),
  getAllInsurance
);
router.get("/:id", authenticate, getInsuranceById);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteInsurance);

module.exports = router;
