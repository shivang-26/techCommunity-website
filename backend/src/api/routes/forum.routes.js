const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../../controllers/forum.controller');
const { protect } = require('../../middleware/auth.middleware');

// Get all forum posts (accessible to everyone)
router.get('/', getPosts);

// Create a new forum post (requires authentication)
router.post('/', protect, createPost);

module.exports = router; 