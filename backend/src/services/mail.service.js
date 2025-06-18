require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("[MAIL] Mail service is loading...");

console.log("[MAIL] SMTP Configuration:");
console.log(`[MAIL] Host: ${process.env.SMTP_HOST}`);
console.log(`[MAIL] Port: ${process.env.SMTP_PORT}`);
console.log(`[MAIL] User: ${process.env.SMTP_USER}`);
console.log(`[MAIL] Pass: ${process.env.SMTP_PASS ? '***SET***' : '***NOT SET***'}`);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // Must be true for Yahoo (465)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection
transporter.verify(function(error, success) {
  if (error) {
    console.error("[MAIL] SMTP Verification failed:", error);
  } else {
    console.log("[MAIL] SMTP Server is ready to take our messages");
  }
});

const sendOTP = async (email, otp) => {
  try {
    console.log(`[OTP] Attempting to send OTP to ${email}`);
    await transporter.sendMail({
      from: `"TechCommunity" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    });
    console.log("[OTP] OTP sent successfully!");
  } catch (error) {
    console.error("[OTP] Error sending OTP:", error.message);
    throw error;
  }
};

module.exports = sendOTP; 