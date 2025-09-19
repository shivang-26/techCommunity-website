import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import loginBanner from "../assets/register&login.png";
import Footer from "../components/footer";
import { UserContext } from "../context/Usercontext";
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, fetchUser } = useContext(UserContext);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      await fetchUser();
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  // Forgot password: Step 1 - Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotSuccess(data.message || "OTP sent to your email.");
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || "Failed to send OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password: Step 2 - Verify OTP
  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotSuccess(data.message || "OTP verified. You can now reset your password.");
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.message || "Failed to verify OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password: Step 3 - Reset Password
  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          newPassword: forgotNewPassword,
          confirmPassword: forgotConfirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForgotSuccess(data.message || "Password reset successful!");
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep(1);
        setForgotSuccess("");
        setForgotEmail("");
        setForgotOtp("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex shadow-lg rounded-lg overflow-hidden w-[850px] h-[450px] bg-white">
        
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Sign In</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </form>

          <div className="mt-2 text-right">
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => {
                setShowForgot(true);
                setForgotStep(1);
                setForgotError("");
                setForgotSuccess("");
                setForgotEmail("");
                setForgotOtp("");
                setForgotNewPassword("");
                setForgotConfirmPassword("");
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Forgot Password Modal */}
          {showForgot && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                  onClick={() => setShowForgot(false)}
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold mb-4 text-center text-blue-700">Forgot Password</h3>
                {forgotError && (
                  <div className="mb-2 text-red-600 text-sm text-center">
                    {forgotError}
                    {forgotError.toLowerCase().includes('user not found') && (
                      <div className="mt-2">
                        <a href="/register" className="text-blue-600 hover:underline text-sm">Register here</a>
                      </div>
                    )}
                  </div>
                )}
                {forgotSuccess && <div className="mb-2 text-green-600 text-sm text-center">{forgotSuccess}</div>}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Registered Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
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
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
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
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-gray-500">or</div>

          {/* Google Login */}
          {/* <div className="mt-6">
            <GoogleSignInButton mode="login" />
          </div> */}

          {/* Register Link */}
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right Side - Banner */}
        <div className="hidden md:flex w-1/2 h-full">
          <img src={loginBanner} alt="Login Banner" className="w-full h-full object-cover" />
        </div>
      
      </div>
    </div>
    
    
  );
};

export default Login;
