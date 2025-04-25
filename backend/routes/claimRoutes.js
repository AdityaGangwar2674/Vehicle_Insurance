const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const {
  createClaim,
  getAllClaims,
  updateClaimStatus,
} = require("../controllers/claimController");

router.post("/newclaim", authenticate, createClaim);
router.get("/allclaims", authenticate, getAllClaims);
router.put("/:id/status", authenticate, updateClaimStatus);

module.exports = router;
