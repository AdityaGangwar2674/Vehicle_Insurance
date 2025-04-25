const express = require("express");
const router = express.Router();
const authenticate = require("../utils/authenticate");
const {
  getCustomerDetails,
  updateCustomerDetails,
  getAllCustomerDetails,
  customerDetails,
} = require("../controllers/customerController");

router.get("/allcustomers", authenticate, getAllCustomerDetails);
router.get("/:id", authenticate, getCustomerDetails);
router.put("/:id", authenticate, updateCustomerDetails);
router.post("/newcustomer", authenticate, customerDetails);

module.exports = router;
