import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerlogin from "../assets/register&login.png";
import Footer from "../components/footer";
import { UserContext } from "../context/Usercontext";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { user, setUser, fetchUser } = useContext(UserContext);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("[REGISTER] Component mounted");
  }, []);

  // Debug: Log form values when they change
  useEffect(() => {
    console.log("[REGISTER] Form values changed:", { username, email, password: password ? "***" : "", confirmPassword: confirmPassword ? "***" : "" });
  }, [username, email, password, confirmPassword]);

  // Test API connectivity
  const testAPI = async () => {
    console.log("[REGISTER] Testing API connectivity...");
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include"
      });
      console.log("[REGISTER] API test response:", response.status);
    } catch (error) {
      console.error("[REGISTER] API test error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("[REGISTER] Form submitted, starting registration process...");
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("[REGISTER] Passwords match, making API call...");
    try {
      console.log("[REGISTER] Sending request to /api/auth/register");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      console.log("[REGISTER] Response received:", response.status);
      const data = await response.json();
      console.log("[REGISTER] Response data:", data);
      if (!response.ok) throw new Error(data.message);
      setSuccess("OTP sent to your email. Please check and enter it below.");
      setStep(2);
    } catch (err) {
      console.error("[REGISTER] Error:", err);
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUser(data.user);
      await fetchUser();
      setSuccess("Email verified! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setError(null);
      console.log('Google response:', response);
      
      const res = await axios.post('/api/auth/google', {
        googleToken: response.code
      }, {
        withCredentials: true
      });

      console.log('Backend response:', res.data);

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

  // ✅ Render Google Button
  useEffect(() => {
    if (window.google && step === 1) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace this with your actual client ID
        callback: handleGoogleSuccess,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignUpBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [step]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex shadow-lg rounded-lg overflow-hidden w-[850px] h-[500px] bg-white">
        <div className="w-1/2 hidden md:block">
          <img src={registerlogin} alt="Register Banner" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-700 text-center">Create an Account</h2>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center">{success}</p>}

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    console.log("[REGISTER] Submit button clicked!");
                    console.log("[REGISTER] About to submit form...");
                  }}
                >
                  Sign Up
                </button>
              </form>

              {/* ✅ Google Sign-Up Button */}
              <div className="mt-4">
                <div id="googleSignUpBtn" className="flex justify-center"></div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-700 text-center">Verify Your Email</h2>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-500 text-sm text-center">{success}</p>}

              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Verify OTP
                </button>
              </form>
            </>
          )}

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
