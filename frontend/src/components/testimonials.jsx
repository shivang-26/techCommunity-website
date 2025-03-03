import React from "react";

const testimonials = [
  {
    name: "Aman Sharma",
    feedback: "TechConnect helped me crack my dream job. The resources and forums are amazing!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Pooja Verma",
    feedback: "I love the community here! Everyone is super helpful, and the placement prep is top-notch.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Ravi Kumar",
    feedback: "The learning resources are a game changer! Easy to follow and very effective.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
        What Our <span className="text-blue-600">Community Says</span>
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center">
            <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4" />
            <h3 className="text-xl font-semibold">{testimonial.name}</h3>
            <p className="text-gray-600 mt-2">"{testimonial.feedback}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
