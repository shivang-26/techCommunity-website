import React, { useState, useEffect, useRef, useContext } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineDown } from "react-icons/ai"; // Add the dropdown arrow icon
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import axios from "axios";
import { UserContext } from "../context/Usercontext";


const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser, fetchUser } = useContext(UserContext);

  const handleNav = () => setNav(!nav);

  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "Cheat Sheets", path: "/cheatsheets" },
    // { id: 3, text: "Placement Prep", path: "/placementprep" },
    { id: 4, text: "Community", path: "/forum" },
    { id: 5, text: "About", path: "/about" },
    // { id: 6, text: "API", path: "/api" },
  ];

  // Fetch authenticated user
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white text-[#333333] shadow-md py-4 px-6 relative">
      <div className="max-w-[1240px] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-27 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.id} className="relative group">
              <Link
                to={item.path}
                className="hover:text-[#007BFF] transition duration-300"
              >
                {item.text}
              </Link>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#007BFF] group-hover:w-full transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* User/Sign In */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-transparent text-[#333333] rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                {/* Profile Picture */}
                <img
                  src={user && (user._id || user.id) ? `/api/auth/profile-picture/${user._id || user.id}` : "/default-profile.png"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover mr-2"
                />
                {/* User Name */}
                <span>{user.username}</span>
                {/* Dropdown Arrow */}
                <AiOutlineDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    User Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-[#333333] text-[#333333] px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-[#007BFF] transition duration-300"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden cursor-pointer" onClick={handleNav}>
          {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <ul
        className={`fixed md:hidden top-0 left-0 w-[70%] h-full bg-white z-50 shadow-lg border-r border-gray-200 transition-transform duration-500 ${
          nav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center space-x-2">
          <Link
            to="/"
            className="text-2xl font-semibold text-[#007BFF]"
            onClick={handleNav}
          >
            
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>
        {navItems.map((item) => (
          <li key={item.id} className="p-4 border-b border-gray-300">
            <Link to={item.path} className="text-[#333333]" onClick={handleNav}>
              {item.text}
            </Link>
          </li>
        ))}
        <div className="p-4">
          {user ? (
            <>
              <p className="mb-2 text-[#333333] font-semibold">{user.username}</p>
              <Link
                to="/dashboard"
                onClick={handleNav}
                className="block text-left text-[#333333] py-2 hover:text-[#007BFF]"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  handleNav();
                }}
                className="mt-2 w-full text-left border border-[#333333] text-[#333333] py-2 rounded-lg hover:bg-gray-100 hover:text-[#007BFF] transition duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-center border border-[#333333] text-[#333333] py-2 rounded-lg hover:bg-gray-100 hover:text-[#007BFF] transition duration-300"
              onClick={handleNav}
            >
              Sign In
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
