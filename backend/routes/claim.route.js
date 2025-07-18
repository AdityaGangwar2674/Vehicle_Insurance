const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.config"); // path to your multer config
const {
  addClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} = require("../controllers/claim.controller");

router.post("/", protect, upload.single("accidentImage"), addClaim);
router.get("/me", protect, getMyClaims); // Customer views their claims
router.get("/", protect, adminOnly, getAllClaims); // Admin views all
router.put("/:id", protect, adminOnly, updateClaimStatus); // Admin updates status

module.exports = router;
