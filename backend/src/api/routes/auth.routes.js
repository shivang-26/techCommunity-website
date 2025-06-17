const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, googleAuth } = require('../../controllers/auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);

module.exports = router; 