import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16 px-6 md:px-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">
        Ready to Level Up Your Tech Journey?
      </h2>
      <p className="mt-4 text-lg">
        Join our thriving community of learners, developers, and tech enthusiasts.  
        Start your journey today!
      </p>

      <div className="mt-6">
        <Link 
          to="/register"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTA;
