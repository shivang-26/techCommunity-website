import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/Usercontext';

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: send otp, 2: otp, 3: new password
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Change password (normal flow)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/auth/change-password',
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      setSuccess(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: Step 1 - Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email: user.email });
      setSuccess(res.data.message || 'OTP sent to your email.');
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: Step 2 - Verify OTP
  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-reset-otp', { email: user.email, otp: forgotOtp });
      setSuccess(res.data.message || 'OTP verified. You can now reset your password.');
      setForgotStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password: Step 3 - Reset Password
  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', {
        email: user.email,
        newPassword: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      });
      setSuccess(res.data.message || 'Password reset successful!');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep(1);
        setSuccess('');
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Change Password</h2>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm text-center">{success}</div>}
        {!showForgot ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => {
                  setShowForgot(true);
                  setError('');
                  setSuccess('');
                }}
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <>
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <div className="mb-2 text-center text-gray-700 text-sm">
                  We will send an OTP to your registered email: <span className="font-semibold">{user?.email}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    className="text-gray-500 hover:underline text-xs"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotStep(1);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Back to Change Password
                  </button>
                </div>
              </form>
            )}
            {forgotStep === 2 && (
              <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={forgotOtp}
                    onChange={e => setForgotOtp(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    className="text-gray-500 hover:underline text-xs"
                    onClick={() => {
                      setForgotStep(1);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
            {forgotStep === 3 && (
              <form onSubmit={handleForgotResetPassword} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={forgotNewPassword}
                    onChange={e => setForgotNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={forgotConfirmPassword}
                    onChange={e => setForgotConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    className="text-gray-500 hover:underline text-xs"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotStep(1);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Back to Change Password
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePassword; 