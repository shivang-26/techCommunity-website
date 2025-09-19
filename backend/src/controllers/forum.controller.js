const ForumPost = require('../models/forumPost.model');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('user', 'username')
      .populate('answers.user', 'username')
      .populate('votedBy', 'username'); // Populate user field, only select the 'username'
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

    console.log('🔍 Forum Create Post Request:');
    console.log('🔍 User from JWT:', req.user);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Headers:', req.headers);

    // Check if user is logged in (handled by protect middleware)
    // The user object is available in req.user thanks to the protect middleware
    if (!req.user) {
        console.log('❌ No user found in request');
        return res.status(401).json({ message: 'Not authorized, no user' });
    }

    const newPost = new ForumPost({
      user: req.user._id,
      title,
      content,
    });

    console.log('🔍 Creating new post with user ID:', req.user._id);

    const createdPost = await newPost.save();

    // Populate the user field in the created post before sending the response
    const populatedPost = await ForumPost.findById(createdPost._id)
      .populate('user', 'username')
      .populate('answers.user', 'username')
      .populate('votedBy', 'username');

    console.log('✅ Post created successfully:', populatedPost);
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('❌ Create post error:', error);
    // Check for validation errors (e.g., missing title or content)
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Vote (toggle) on a forum post
// @route   PUT /api/forum/:id/vote
// @access  Private
const votePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const hasVoted = post.votedBy.map(id => id.toString()).includes(userId);

    if (hasVoted) {
      // Remove vote
      post.votes = Math.max(0, post.votes - 1);
      post.votedBy = post.votedBy.filter(id => id.toString() !== userId);
    } else {
      // Add vote
      post.votes += 1;
      post.votedBy.push(req.user._id);
    }

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'username')
      .populate('answers.user', 'username')
      .populate('votedBy', 'username');

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add answer to a forum post
// @route   POST /api/forum/:id/answer
// @access  Private
const addAnswer = async (req, res) => {
  try {
    const { answer } = req.body;

    console.log('🔍 Forum Add Answer Request:');
    console.log('🔍 User from JWT:', req.user);
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Post ID:', req.params.id);

    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ message: 'Answer content is required' });
    }

    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('🔍 Adding answer with user ID:', req.user._id);

    post.answers.push({
      user: req.user._id,
      answer: answer.trim()
    });

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'username')
      .populate('answers.user', 'username')
      .populate('votedBy', 'username');

    console.log('✅ Answer added successfully');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('❌ Add answer error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a forum post
// @route   DELETE /api/forum/:id
// @access  Private (only post owner or admin)
const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Only allow the owner or an admin to delete
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an answer from a forum post
// @route   DELETE /api/forum/:postId/answer/:answerId
// @access  Private (only answer owner or admin)
const deleteAnswer = async (req, res) => {
  try {
    const { postId, answerId } = req.params;
    
    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the answer in the post using .find for robustness
    const answer = post.answers.find(a => a._id.toString() === answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Only allow the answer owner or an admin to delete
    if (answer.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    // Remove the answer using .filter
    post.answers = post.answers.filter(a => a._id.toString() !== answerId);
    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'username')
      .populate('answers.user', 'username')
      .populate('votedBy', 'username');

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  votePost,
  addAnswer,
  deletePost,
  deleteAnswer,
}; 