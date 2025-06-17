const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./api/routes/auth.routes");
const userRoutes = require("./api/routes/user.routes");
const forumRoutes = require("./api/routes/forum.routes");
const resourceRoutes = require("./api/routes/resource.routes");
const chatbotRoutes = require("./api/routes/chatbot.routes");

// Import middleware
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/notFound.middleware");
const sessionMiddleware = require("./config/session.config");

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "${import.meta.env.VITE_FRONTEND_URL}",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Session middleware
app.use(sessionMiddleware);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app; 