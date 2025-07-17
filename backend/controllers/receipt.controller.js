const Receipt = require("../models/receipt.model");
const Customer = require("../models/customer.model");

const generateReceiptNumber = () =>
  `RCT${Math.floor(100000 + Math.random() * 900000)}`;

exports.generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.body;

    // Find the customer's record
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const newReceipt = await Receipt.create({
      customerId: customer._id,
      paymentId,
      receiptNumber: generateReceiptNumber(),
    });

    res.status(201).json(newReceipt);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating receipt", error: err.message });
  }
};

exports.getMyReceipts = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const receipts = await Receipt.find({ customerId: customer._id }).populate(
      "paymentId"
    );

    res.status(200).json(receipts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching receipts", error: err.message });
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate("customerId")
      .populate("paymentId");
    res.status(200).json(receipts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all receipts", error: err.message });
  }
};
