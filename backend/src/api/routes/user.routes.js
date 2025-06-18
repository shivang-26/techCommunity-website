const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');

// Get user profile (requires authentication)
router.get('/profile', protect, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile (requires authentication)
router.put('/profile', protect, (req, res) => {
  // TODO: Implement user profile update
  res.json({ message: 'Profile update not implemented yet' });
});

module.exports = router; 