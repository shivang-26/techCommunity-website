require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("[MAIL] Mail service is loading...");

console.log("[MAIL] SMTP Configuration:");
console.log(`[MAIL] Host: ${process.env.SMTP_HOST}`);
console.log(`[MAIL] Port: ${process.env.SMTP_PORT}`);
console.log(`[MAIL] User: ${process.env.SMTP_USER}`);
console.log(`[MAIL] Pass: ${process.env.SMTP_PASS ? '***SET***' : '***NOT SET***'}`);

let transporter = null;

// Only create transporter if SMTP config is available
if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Must be true for Yahoo (465)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection asynchronously
    transporter.verify(function(error, success) {
      if (error) {
        console.error("[MAIL] SMTP Verification failed:", error.message);
      } else {
        console.log("[MAIL] SMTP Server is ready to take our messages");
      }
    });
  } catch (error) {
    console.error("[MAIL] Failed to create transporter:", error.message);
  }
} else {
  console.warn("[MAIL] SMTP configuration is incomplete. Mail service will not be available.");
}

const sendOTP = async (email, otp) => {
  if (!transporter) {
    console.error("[MAIL] Mail transporter is not available");
    throw new Error("Mail service is not configured");
  }

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