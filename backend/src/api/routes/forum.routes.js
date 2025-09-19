const express = require('express');
const router = express.Router();
const { getPosts, createPost, votePost, addAnswer, deletePost, deleteAnswer } = require('../../controllers/forum.controller');
const { protect } = require('../../middleware/auth.middleware');

// Get all forum posts (accessible to everyone)
router.get('/', getPosts);

// Create a new forum post (requires authentication)
router.post('/', protect, createPost);

// Vote on a forum post (requires authentication)
router.put('/:id/vote', protect, votePost);

// Add answer to a forum post (requires authentication)
router.post('/:id/answer', protect, addAnswer);

// Delete an answer from a forum post (requires authentication)
router.delete('/:postId/answer/:answerId', protect, deleteAnswer);

// Delete a forum post (requires authentication)
router.delete('/:id', protect, deletePost);

module.exports = router; 