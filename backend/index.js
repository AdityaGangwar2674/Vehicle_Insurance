const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const claimRoutes = require("./routes/claimRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // or '*' for all origins
    credentials: true, // Allow sending cookies with requests
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/claim", claimRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
