const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const User = require("../models/User");
const sendOTP = require("../services/mailService");
const OTP = require("../models/OTP");

const router = express.Router();

// ✅ Configure session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Store in env
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production", // Secure only in production
      httpOnly: true, 
      sameSite: "lax", // Fix for cross-site issues
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Register User & Send OTP
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Trim & normalize input
    username = username?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "User already exists. Try logging in." });
    }

    

    // ✅ Save user as NOT verified
    const newUser = new User({ username, email, password, isVerified: false });
    

    await newUser.save();

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Store OTP in DB (Ensure only one OTP exists per email)
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: Date.now() + 300000 }, // 5 min expiry
      { upsert: true }
    );

    // ✅ Send OTP to email
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent. Verify to complete registration." });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Verify OTP & Activate User
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // ✅ Check OTP in DB
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    // ✅ Remove OTP after verification
    await OTP.deleteOne({ email, otp });

    // ✅ Mark user as verified
    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Auto-login user after verification (Session)
    req.session.user = { id: user._id, username: user.username, email: user.email, isVerified: true };
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session Save Error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      res.status(200).json({ message: "Email verified! Redirecting to dashboard.", user: req.session.user });
      
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Login User (Using Sessions)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // ✅ Store user in session
    req.session.user = { id: user._id, username: user.username, email: user.email, isVerified: true };
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session Save Error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      res.status(200).json({ message: "Login successful! Redirecting to dashboard.", user: req.session.user });
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Logout User
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Remove session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// ✅ Check if User is Logged In
router.get("/me", (req, res) => {
  console.log("🔍 Session ID:", req.sessionID);
  console.log("🔍 Session Data:", req.session);  // ✅ Check session data
  console.log("🔍 Cookies Sent:", req.cookies);  // ✅ Check if cookie is received

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: No session user" });
  }

  res.json({ user: req.session.user });
});

// ✅ Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// ✅ Example: Protected Route (User Dashboard)
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Welcome to your dashboard", user: req.session.user });
});

module.exports = router;
