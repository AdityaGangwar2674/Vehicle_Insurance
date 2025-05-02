const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");
const {
  createClaim,
  getAllClaims,
  updateClaimStatus,
} = require("../controllers/claimController");

router.post("/newclaim", authenticate, createClaim);
router.get("/allclaims", authenticate, authorizeRole("admin"), getAllClaims);
router.put(
  "/:id/status",
  authenticate,
  authorizeRole("admin"),
  updateClaimStatus
);

module.exports = router;
