const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "default_secret", // Ensure SECRET is defined
  resave: false,
  saveUninitialized: true, // Allow uninitialized sessions (adjust if needed)
  cookie: { 
    secure: process.env.NODE_ENV === "production", // Secure only in production
    httpOnly: true, 
    maxAge: 3600000, // 1 hour session
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin cookies in production
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
});

module.exports = sessionMiddleware;
