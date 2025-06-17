const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const sessionMiddleware = require("./config/sessionConfig"); // Import session config
const authRoutes = require("./routes/auth");
const userRoutes = require("./models/User"); // Fix import (should be userRoutes, not User model)

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "${import.meta.env.VITE_FRONTEND_URL}", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// ✅ Use session middleware
app.use(sessionMiddleware);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { // Required for MongoDB Atlas (or ssl: true for older setups)
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes); // Use correct route path

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
