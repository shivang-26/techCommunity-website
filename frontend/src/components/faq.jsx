import React from "react";

const faqData = [
  { question: "Is TechConnect free to use?", answer: "Yes, TechConnect is completely free for all users." },
  { question: "How can I join the community?", answer: "You can join by signing up and accessing the forums." },
  { question: "Are there any paid courses?", answer: "No, all learning resources are freely accessible." },
  { question: "How do I prepare for placements?", answer: "Check out our placement prep section for mock tests and guides." },
];

const Faq = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
        Frequently Asked <span className="text-blue-600">Questions</span>
      </h2>

      {/* FAQ Grid in 2x2 format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
            <p className="mt-2 text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
