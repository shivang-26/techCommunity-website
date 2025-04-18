const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { MongoClient, ServerApiVersion } = require("mongodb");

const sessionMiddleware = require("./config/sessionConfig");
const authRoutes = require("./routes/auth");
const userRoutes = require("./models/User"); // Fix path if incorrect

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(sessionMiddleware);

// ✅ MongoDB Native Connection
const uri = process.env.MONGO_URI; // Should be like: mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged MongoDB. Successfully connected!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}
connectToMongoDB();

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
