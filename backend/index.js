const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const customerRoutes = require("./routes/customer.route");
const vehicleRoutes = require("./routes/vehicle.route");
const insuranceRoutes = require("./routes/insurance.route");
const claimRoutes = require("./routes/claim.route");
const paymentRoutes = require("./routes/payment.route");
const receiptRoutes = require("./routes/receipt.route");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/receipts", receiptRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🚗 Vehicle Insurance Management System API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});
