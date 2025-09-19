const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const ForumPost = require('../../models/forumPost.model');
const { protect, admin } = require('../../middleware/auth.middleware');

// @route   GET /api/admin/analytics
// @desc    Get admin analytics data
// @access  Private/Admin
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });

    // Get forum statistics
    const totalPosts = await ForumPost.countDocuments();
    const totalAnswers = await ForumPost.aggregate([
      { $unwind: '$answers' },
      { $count: 'totalAnswers' }
    ]);
    const recentPosts = await ForumPost.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
    });

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get forum activity data (last 30 days)
    const forumActivity = await ForumPost.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          posts: { $sum: 1 },
          answers: { $sum: { $size: '$answers' } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get top active users
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: 'forumposts',
          localField: '_id',
          foreignField: 'user',
          as: 'posts'
        }
      },
      {
        $addFields: {
          totalPosts: { $size: '$posts' },
          totalAnswers: {
            $sum: {
              $map: {
                input: '$posts',
                as: 'post',
                in: { $size: '$$post.answers' }
              }
            }
          }
        }
      },
      {
        $addFields: {
          totalActivity: { $add: ['$totalPosts', '$totalAnswers'] }
        }
      },
      {
        $sort: { totalActivity: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          username: 1,
          email: 1,
          totalPosts: 1,
          totalAnswers: 1,
          totalActivity: 1
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        admins: adminUsers,
        recent: recentUsers,
        growth: userGrowth
      },
      forum: {
        totalPosts: totalPosts,
        totalAnswers: totalAnswers.length > 0 ? totalAnswers[0].totalAnswers : 0,
        recentPosts: recentPosts,
        activity: forumActivity
      },
      topUsers
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get quick admin stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await ForumPost.countDocuments();
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    const recentPosts = await ForumPost.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });

    res.json({
      totalUsers,
      totalPosts,
      recentUsers,
      recentPosts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and search
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user's forum posts
    await ForumPost.deleteMany({ user: req.params.id });

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/forum/posts
// @desc    Get all forum posts with pagination and search
// @access  Private/Admin
router.get('/forum/posts', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [posts, total] = await Promise.all([
      ForumPost.find(query)
        .populate('user', 'username email profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ForumPost.countDocuments(query)
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/forum/posts/:id
// @desc    Delete forum post
// @access  Private/Admin
router.delete('/forum/posts/:id', protect, admin, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/activity
// @desc    Get recent system activity
// @access  Private/Admin
router.get('/activity', protect, admin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent user registrations
    const recentUsers = await User.find()
      .select('username email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get recent forum posts
    const recentPosts = await ForumPost.find()
      .populate('user', 'username')
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Combine and sort activities
    const activities = [
      ...recentUsers.map(user => ({
        type: 'user_registration',
        user: user.username || 'Unknown User',
        email: user.email || '',
        timestamp: user.createdAt,
        message: `${user.username || 'Unknown User'} registered`
      })),
      ...recentPosts.map(post => ({
        type: 'forum_post',
        user: post.user?.username || 'Unknown User',
        title: post.title || 'Untitled Post',
        timestamp: post.createdAt,
        message: `${post.user?.username || 'Unknown User'} created a post: ${post.title || 'Untitled Post'}`
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({ activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/top-content
// @desc    Get top performing content
// @access  Private/Admin
router.get('/top-content', protect, admin, async (req, res) => {
  try {
    // Get most voted posts
    const topPosts = await ForumPost.find()
      .populate('user', 'username')
      .select('title votes answers createdAt')
      .sort({ votes: -1 })
      .limit(10)
      .lean();

    // Get most answered posts using a simpler approach
    const mostAnswered = await ForumPost.find()
      .populate('user', 'username')
      .select('title answers createdAt')
      .lean()
      .then(posts => {
        return posts
          .map(post => ({
            ...post,
            answerCount: (post.answers || []).length
          }))
          .sort((a, b) => b.answerCount - a.answerCount)
          .slice(0, 10);
      });

    res.json({
      topPosts: topPosts.map(post => ({
        _id: post._id,
        title: post.title || 'Untitled Post',
        votes: post.votes || 0,
        answers: post.answers || [],
        createdAt: post.createdAt,
        user: {
          username: post.user?.username || 'Unknown User'
        }
      })),
      mostAnswered: mostAnswered.map(post => ({
        _id: post._id,
        title: post.title || 'Untitled Post',
        answers: post.answers || [],
        createdAt: post.createdAt,
        user: {
          username: post.user?.username || 'Unknown User'
        }
      }))
    });
  } catch (error) {
    console.error('Get top content error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
