const Payment = require("../models/PaymentModel");

const makePayment = async (req, res) => {
  const { customer, insurance, amount, paymentMethod, status } = req.body;
  try {
    const payment = new Payment({
      customer,
      insurance,
      amount,
      paymentMethod,
      status,
    });
    await payment.save();
    res
      .status(201)
      .json({ success: true, message: "Payment recorded", data: payment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("customer insurance");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      "customer insurance"
    );
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  makePayment,
  getAllPayments,
  getPaymentById,
};
