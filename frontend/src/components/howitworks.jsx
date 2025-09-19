import React from "react";
import { UserPlusIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

const HowItWorks = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-16">
      {/* Section Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        How <span className="text-blue-600">TechConnect</span> Works?
      </h2>

      {/* Steps Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Step 1 - Sign Up */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <UserPlusIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Sign Up</h3>
          <p className="text-gray-600 mt-2">Create an account and join the community.</p>
        </div>

        {/* Step 2 - Explore Resources */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <BookOpenIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Explore Resources</h3>
          <p className="text-gray-600 mt-2">Learn from curated guides and expert forums.</p>
        </div>

        {/* Step 3 - Engage & Grow */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <ChatBubbleLeftEllipsisIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Engage & Grow</h3>
          <p className="text-gray-600 mt-2">Participate in discussions & enhance your skills.</p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
