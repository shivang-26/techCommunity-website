const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../../controllers/chatbot.controller');

// Chat endpoint - public access
router.post('/chatbot', chatWithBot);

module.exports = router;