const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

// NestJS-style custom logger
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    const icon = status >= 400 ? "❌" : "🛰️";
    console.log(`${icon} ${new Date().toLocaleTimeString()} [${method}] ${url} - ${status} (${elapsed}ms)`);
  });
  next();
};

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
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(logger);

const apiResponse = require("./utils/apiResponse");

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

// 404 Handler
app.use((req, res) => {
  return apiResponse(res, false, "Route not found", {}, 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  return apiResponse(res, false, "Internal Server Error", { error: err.message }, 500);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});
