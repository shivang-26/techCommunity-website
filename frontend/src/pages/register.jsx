import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerlogin from "../assets/register&login.png";
import Footer from "../components/footer";
import { UserContext } from "../context/Usercontext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { user, setUser, fetchUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("OTP sent to your email. Verify to continue.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("OTP verified! Logging you in...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Handle Google Sign-Up
  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Render Google Button
  useEffect(() => {
    if (window.google && step === 1) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace this with your actual client ID
        callback: handleGoogleResponse,
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
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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

              <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
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
