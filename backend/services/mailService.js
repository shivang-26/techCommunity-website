require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Must be true for Yahoo (465)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"TechCommunity" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log("OTP sent successfully!");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

module.exports = sendOTP;
