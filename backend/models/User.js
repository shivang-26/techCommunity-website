const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true }, // Ensures case-insensitive uniqueness
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Email verification status
  },
  { timestamps: true }
);

// Hash password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate authentication token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = mongoose.model("User", UserSchema);
