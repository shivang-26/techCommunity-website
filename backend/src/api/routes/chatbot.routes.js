const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { chatWithBot } = require('../../controllers/chatbot.controller');

// Chat endpoint
router.post('/chat', protect, chatWithBot);

module.exports = router; 