const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, googleAuth, changePassword, forgotPassword, verifyResetOtp, resetPassword, uploadProfilePicture, upload, serveProfilePicture } = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

// Profile picture upload route
router.post('/upload-profile-pic', protect, upload.single('profilePic'), uploadProfilePicture);
// Serve profile picture
router.get('/profile-picture/:userId', serveProfilePicture);

module.exports = router; 