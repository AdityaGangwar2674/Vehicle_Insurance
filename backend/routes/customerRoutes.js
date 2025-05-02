const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const authorizeRole = require("../utils/authorizeRole");
const {
  getCustomerDetails,
  updateCustomerDetails,
  getAllCustomerDetails,
  customerDetails,
} = require("../controllers/customerController");

router.get(
  "/allcustomers",
  authenticate,
  authorizeRole("admin"),
  getAllCustomerDetails
);
router.get("/:id", authenticate, getCustomerDetails);
router.put("/:id", authenticate, updateCustomerDetails);
router.post("/newcustomer", authenticate, customerDetails);

module.exports = router;
