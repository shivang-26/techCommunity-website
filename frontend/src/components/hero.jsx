import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-img.png"; // Ensure correct path

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-screen px-6 md:px-16 bg-gray-100 " >
      
      {/* Left Section - Text Content */}
      <div className="text-center md:text-left max-w-2xl" >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Empowering <span className="text-blue-600">Tech Enthusiasts</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Join a thriving community of developers, students, and professionals.
          Collaborate, learn, and grow together.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link 
            to="/register" 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Join the Community
          </Link>
          <Link 
            to="/features" 
            className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Explore Features
          </Link>
        </div>
      </div>

      {/* Right Section - Hero Image */}
      <div className="mt-8 md:mt-0 w-[80%] md:w-[40%] flex justify-center">
        <img 
          src={heroImage} 
          alt="Community Illustration" 
          className="w-full md:w-[400px] object-cover bg-transparent shadow-none"
        />
      </div>
    </div>
  );
};

export default Hero;
