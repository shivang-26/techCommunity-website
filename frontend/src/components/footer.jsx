import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Brand Name */}
        <h2 className="text-2xl font-bold">TechConnect</h2>

        {/* Navigation Links */}
        <nav className="flex gap-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/features" className="hover:text-blue-400">Features</Link>
          <Link to="/community" className="hover:text-blue-400">Community</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
        </nav>

        {/* Social Media Links (Removed Twitter) */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-6 h-6 hover:text-blue-400" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-6 h-6 hover:text-blue-400" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="text-center text-gray-500 mt-6 text-sm">
        © 2024 TechConnect. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
