import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/Usercontext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const GoogleSignInButton = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (response) => {
    try {
      setError(null);
      console.log('Google response:', response); // Debug log
      
      const res = await axios.post('${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/google', {
        googleToken: response.code // Changed from access_token to code
      }, {
        withCredentials: true
      });

      console.log('Backend response:', res.data); // Debug log

      if (res.data.user) {
        setUser(res.data.user);
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      setError(error.response?.data?.error || 'Authentication failed. Please try again.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError('Google sign-in failed. Please try again.');
    },
    flow: 'auth-code', // Changed from 'implicit' to 'auth-code'
    scope: 'email profile', // Explicitly specify required scopes
    ux_mode: 'popup' // Use popup mode for better UX
  });

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          console.log('Starting Google login...'); // Debug log
          login();
        }}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
      </motion.button>
    </div>
  );
};

export default GoogleSignInButton; 