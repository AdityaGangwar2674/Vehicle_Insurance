const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  addClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} = require("../controllers/claim.controller");

router.post("/", protect, addClaim); // Customer adds a claim
router.get("/me", protect, getMyClaims); // Customer views their claims
router.get("/", protect, adminOnly, getAllClaims); // Admin views all
router.put("/:id", protect, adminOnly, updateClaimStatus); // Admin updates status

module.exports = router;
