const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const User = require("../src/models/user.model");
const sendOTP = require("../src/services/mail.service");
const OTP = require("../src/models/otp.model");
const axios = require("axios");
const { uploadProfilePicture, serveProfilePicture, upload } = require("../src/controllers/auth.controller");

const router = express.Router();

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CLIENT_URL || 'http://localhost:5173'
);

// ✅ Configure session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, 
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ JWT Protect Middleware
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ✅ Register User & Send OTP (Session-based)
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
    console.log(`[REGISTER] Generated OTP: ${otp} for email: ${email}`);

    // ✅ Store OTP in DB (Ensure only one OTP exists per email)
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: Date.now() + 300000 }, // 5 min expiry
      { upsert: true }
    );
    console.log(`[REGISTER] OTP stored in database for email: ${email}`);

    // ✅ Send OTP to email
    console.log(`[REGISTER] About to send OTP to email: ${email}`);
    await sendOTP(email, otp);
    console.log(`[REGISTER] OTP send completed for email: ${email}`);

    res.status(200).json({ message: "OTP sent. Verify to complete registration." });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Verify OTP & Activate User (Session-based)
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
    req.session.user = { id: user._id, username: user.username, email: user.email, isVerified: true, role: user.role };
    
    console.log('✅ User verified and session created for:', user.username, 'with role:', user.role);
    
    // ✅ Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set!');
      return res.status(500).json({ message: "Server configuration error" });
    }

    // ✅ Generate JWT token for forum access
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('✅ JWT token generated for user ID:', user._id);

    // ✅ Set JWT token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('✅ JWT token set in cookie');

    req.session.save((err) => {
      if (err) {
        console.error("❌ Session Save Error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      console.log('✅ Session saved for user:', user.username, 'with role:', user.role);
      res.status(200).json({ message: "Email verified! Redirecting to dashboard.", user: req.session.user });
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Login User (Session-based)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      console.log('❌ User not verified for email:', email);
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Invalid password for email:', email);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    console.log('✅ Password validated for user:', user.username);

    // ✅ Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set!');
      return res.status(500).json({ message: "Server configuration error" });
    }

    // ✅ Generate JWT token for forum access
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('✅ JWT token generated for user ID:', user._id);

    // ✅ Set JWT token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('✅ JWT token set in cookie');

    // ✅ Store user in session
    req.session.user = { id: user._id, username: user.username, email: user.email, isVerified: true, role: user.role };
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session Save Error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      console.log('✅ Session saved for user:', user.username, 'with role:', user.role);
      res.status(200).json({ message: "Login successful! Redirecting to dashboard.", user: req.session.user });
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Logout User (Session-based)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    // Clear both session and JWT cookies
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// ✅ Check if User is Logged In (Session-based)
router.get("/me", (req, res) => {
  console.log("🔍 Session ID:", req.sessionID);
  console.log("🔍 Session Data:", req.session);
  console.log("🔍 Cookies Sent:", req.cookies);

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: No session user" });
  }

  res.json({ user: req.session.user });
});

// ✅ JWT-based Login (Alternative)
router.post("/login-jwt", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ JWT-based Get Current User
router.get("/me-jwt", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ JWT-based Logout
router.post("/logout-jwt", async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Google OAuth authentication
router.post("/google", async (req, res) => {
  try {
    const { googleToken: code } = req.body;
    console.log('Received code:', code);

    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);
    console.log('Received tokens:', tokens);

    // Get user info from the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Token payload:', payload);

    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email,
        username: name,
        profilePicture: picture,
        googleId,
        isVerified: true,
        authProvider: 'google'
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if they haven't used Google before
      user.googleId = googleId;
      user.authProvider = 'google';
      if (!user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error authenticating with Google',
      details: error.message 
    });
  }
});

// ✅ Middleware to protect routes (Session-based)
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

// ✅ Test JWT token generation
router.get("/test-jwt", (req, res) => {
  console.log('🔍 Testing JWT token generation...');
  console.log('🔍 JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('🔍 JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not set' });
  }
  
  try {
    const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ JWT token generated successfully');
    res.json({ success: true, token: testToken });
  } catch (error) {
    console.error('❌ JWT token generation failed:', error);
    res.status(500).json({ error: 'JWT token generation failed', details: error.message });
  }
});

// Profile picture upload route
router.post('/upload-profile-pic', protect, upload.single('profilePic'), uploadProfilePicture);
// Serve profile picture
router.get('/profile-picture/:userId', serveProfilePicture);

module.exports = router; 