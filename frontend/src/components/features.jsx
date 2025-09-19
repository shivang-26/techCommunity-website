import React from "react";
import { AcademicCapIcon, ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const Features = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-16">
      {/* Section Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        Why Choose <span className="text-blue-600">TechConnect?</span>
      </h2>

      {/* Features Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature 1 - Learning Resources */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <AcademicCapIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Learning Resources</h3>
          <p className="text-gray-600 mt-2">Access curated cheat sheets and guides.</p>
        </div>

        {/* Feature 2 - Community Forums */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <ChatBubbleLeftRightIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Community Forums</h3>
          <p className="text-gray-600 mt-2">Engage with tech enthusiasts and experts.</p>
        </div>

        {/* Feature 3 - Placement Prep */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
          <ClipboardDocumentCheckIcon className="w-14 h-14 text-blue-600" />
          <h3 className="mt-4 text-xl font-semibold">Placement Prep</h3>
          <p className="text-gray-600 mt-2">Ace your interviews with mock tests.</p>
        </div>

      </div>
    </section>
  );
};

export default Features;
