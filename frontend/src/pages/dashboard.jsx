import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DEFAULT_IMAGE = "https://www.w3schools.com/howto/img_avatar.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(DEFAULT_IMAGE);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        if (res.data.user?.profilePic) {
          setProfilePic(res.data.user.profilePic);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Temporarily set the profile pic
      };
      reader.readAsDataURL(file);
  
      // Now send the file to the backend to store it
      const formData = new FormData();
      formData.append("profilePic", file);
  
      axios
        .post("http://localhost:5000/auth/upload-profile-pic", formData, {
          withCredentials: true,
        })
        .then((res) => {
          // Update user profile picture after successful upload
          setProfilePic(res.data.profilePic);  // Assuming the backend returns the image URL
          // Optionally, update the user profile picture in the local state as well
          setUser({ ...user, profilePic: res.data.profilePic });
        })
        .catch((err) => {
          console.error("Error uploading profile picture:", err);
        });
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-black text-left">Profile</h2>
        {/* Edit Profile Button */}
        <button
          onClick={() => navigate("/change-password")}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Change Password
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-6 mb-8">
        {/* Profile Picture with Upload Option */}
        <div className="relative w-24 h-24 flex-shrink-0 cursor-pointer">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full rounded-full border-2 border-white object-cover"
            onClick={() => fileInputRef.current.click()}  // Trigger file upload on click
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfileChange}
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Activity Section */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">Activity</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b mb-4 pb-2 text-sm font-medium">
        <button className="text-[#2563eb] border-b-2 border-[#2563eb]">Personal</button>
        <button className="hover:text-[#2563eb]">Mentions</button>
        <button className="hover:text-[#2563eb]">Favorites</button>
        <button className="hover:text-[#2563eb]">Friends</button>
        <button className="hover:text-[#2563eb]">Groups</button>
      </div>

      {/* Post Input */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-6">
        <textarea
          rows="3"
          className="w-full border rounded p-2 focus:outline-none text-sm md:text-base"
          placeholder={`What's new, ${user?.username}?`}
        ></textarea>
        <div className="mt-2 flex justify-end">
          <button className="bg-[#2563eb] text-white px-3 md:px-4 py-1 rounded hover:bg-blue-700 text-sm">
            Post Update
          </button>
        </div>
      </div>

      {/* Sample Posts */}
      <div className="space-y-4">
        <Post name="Rubens Barrachello" time="6 hours ago" comment="Awesome!" />
        <Post name="Rubens Barrachello" time="2 days ago" comment="ghh" />
      </div>
    </div>
  );
};

const Post = ({ name, comment, time }) => (
  <div className="border p-3 md:p-4 rounded-lg shadow bg-white">
    <div className="flex items-center mb-2">
      <img
        src="https://randomuser.me/api/portraits/men/45.jpg"
        alt="user"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3"
      />
      <div>
        <p className="font-medium text-sm md:text-base">{name}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <p className="text-sm">{comment}</p>
    <div className="mt-2 flex gap-3 text-sm text-gray-500">
      <button className="hover:text-[#2563eb]">⭐ Favorite</button>
      <button className="hover:text-red-500">🗑 Delete</button>
    </div>
  </div>
);

export default Dashboard;
