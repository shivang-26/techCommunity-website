import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import loginBanner from "../assets/register&login.png";
import Footer from "../components/footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
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

          <div className="mt-4 text-center text-gray-500">or</div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition mt-3">
            <FcGoogle size={22} />
            Sign In with Google
          </button>

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
