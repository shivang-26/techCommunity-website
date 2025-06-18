const express = require('express');
const router = express.Router();

// Get all resources
router.get('/', (req, res) => {
  res.json({ message: 'Resources endpoint - not implemented yet' });
});

// Get specific resource
router.get('/:id', (req, res) => {
  res.json({ message: 'Resource details - not implemented yet' });
});

module.exports = router; 