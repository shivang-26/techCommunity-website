import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch logged-in user session
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        navigate("/login"); // Redirect if not logged in
      });
  }, [navigate]);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Welcome, <strong>{user.username}</strong>!</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
