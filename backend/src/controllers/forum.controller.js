const ForumPost = require('../models/forumPost.model');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('user', 'name'); // Populate user field, only select the 'name'
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a forum post
// @route   POST /api/forum
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if user is logged in (handled by protect middleware)
    // The user object is available in req.user thanks to the protect middleware
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user' });
    }

    const newPost = new ForumPost({
      user: req.user._id,
      title,
      content,
    });

    const createdPost = await newPost.save();

    // Populate the user field in the created post before sending the response
    const populatedPost = await ForumPost.findById(createdPost._id).populate('user', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    // Check for validation errors (e.g., missing title or content)
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPosts,
  createPost,
}; 