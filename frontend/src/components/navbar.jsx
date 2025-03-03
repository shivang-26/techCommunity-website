import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => setNav(!nav);

  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "Portfolio", path: "/about" },
    { id: 3, text: "Cheat Sheets", path: "/cheatsheets" },
    { id: 4, text: "Placement Prep", path: "/placementprep" },
    { id: 5, text: "Forum", path: "/forum" },
    { id: 6, text: "API", path: "/api" },
  ];

  return (
    <nav className="bg-white text-[#333333] shadow-md py-4 px-6">
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

        {/* Sign In Button */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded-lg hover:bg-[#007BFF] hover:text-white transition duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden cursor-pointer" onClick={handleNav}>
          {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <ul
        className={`fixed md:hidden top-0 left-0 w-[70%] h-full bg-white shadow-lg border-r border-gray-200 transition-transform duration-500 ${
          nav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <Link
            to="/"
            className="text-2xl font-semibold text-[#007BFF]"
            onClick={handleNav}
          >
            TechConnect
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
          <Link
            to="/login"
            className="block text-center border border-[#007BFF] text-[#007BFF] py-2 rounded-lg hover:bg-[#007BFF] hover:text-white transition duration-300"
            onClick={handleNav}
          >
            Sign In
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
