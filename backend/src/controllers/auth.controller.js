const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  '${import.meta.env.VITE_FRONTEND_URL}' // Your frontend URL
);

// ... existing code ...

const googleAuth = async (req, res) => {
    try {
        const { googleToken: code } = req.body;
        console.log('Received code:', code); // Debug log

        // Exchange the authorization code for tokens
        const { tokens } = await client.getToken(code);
        console.log('Received tokens:', tokens); // Debug log

        // Get user info from the ID token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        console.log('Token payload:', payload); // Debug log

        const { email, name, picture, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                email,
                name,
                profilePicture: picture,
                googleId,
                isVerified: true, // Google accounts are pre-verified
                authProvider: 'google'
            });
        } else if (!user.googleId) {
            // Update existing user with Google ID if they haven't used Google before
            user.googleId = googleId;
            user.authProvider = 'google';
            if (!user.profilePicture) {
                user.profilePicture = picture;
            }
            await user.save();
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error authenticating with Google',
            details: error.message 
        });
    }
};

module.exports = {
    // ... existing exports ...
    googleAuth
}; 