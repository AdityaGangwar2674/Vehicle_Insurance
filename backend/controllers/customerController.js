const express = require("express");
const Customer = require("../models/CustomerModel");

const getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    return res.status(200).json({ success: true, data: customer });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllCustomerDetails = async (req, res) => {
  try {
    const customers = await Customer.find({});
    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching customers",
    });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    return res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const customerDetails = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, message: "Customer already exists" });
    }
    const newCustomer = new Customer({ name, email, phone, address });
    await newCustomer.save();
    return res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCustomerDetails,
  updateCustomerDetails,
  getAllCustomerDetails,
  customerDetails,
};
