import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTensorflow, SiPytorch, SiDocker, SiGit } from "react-icons/si";
import profile from "../assets/profile.jpeg";
import Footer from "../components/footer"; 


const techStack = [
  { icon: <SiReact className="text-blue-500 text-6xl" />, name: "React.js" },
  { icon: <SiNodedotjs className="text-green-500 text-6xl" />, name: "Node.js" },
  { icon: <SiExpress className="text-gray-700 text-6xl" />, name: "Express.js" },
  { icon: <SiMongodb className="text-green-700 text-6xl" />, name: "MongoDB" },
  { icon: <SiTensorflow className="text-orange-500 text-6xl" />, name: "TensorFlow" },
  { icon: <SiPytorch className="text-red-500 text-6xl" />, name: "PyTorch" },
  { icon: <SiDocker className="text-blue-500 text-6xl" />, name: "Docker" },
  { icon: <SiGit className="text-red-600 text-6xl" />, name: "Git & GitHub" }
];

const projects = [
    {
      title: "Complaint Categorization using Image Captioning & Generative AI",
      description: "AI-driven system for automatic complaint classification using EfficientNet-B0, Swin Transformers, and GenAI.",
      link: "#" // Replace with actual link
    },
    {
      title: "Mental Health Chatbot",
      description: "AI-powered chatbot using ML, DL, NLP for text-based mental health assistance.",
      link: "#" // Replace with actual link
    },
    {
      title: "UnifiedHands – AI-Powered Community Support Platform",
      description: "AI-based web app leveraging image and text analysis for social impact.",
      link: "#" // Replace with actual link
    },
    {
      title: "Appointlet – Intelligent Scheduling System",
      description: "AI-driven patient appointment scheduling system.",
      link: "#" // Replace with actual link
    }
  ];

const AboutSection = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gray-100 text-foreground py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4">
              Welcome to <span className="text-blue-600">TechConnect</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
            At TechConnect, we believe in the power of collaboration to drive AI innovation. Our mission is to create a space where AI enthusiasts, developers, and researchers can connect, share knowledge, and develop groundbreaking AI solutions together.
            </p>
            <a href="/register">
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg transform hover:scale-105">
            Join Now
            </button></a>
          </motion.div>

          {/* Profile & Portfolio */}
          <motion.div 
            className="md:w-1/2 flex justify-center mt-8 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition">
              <img 
                src={profile}
                alt="Your Profile" 
                className="rounded-full w-36 h-36 mx-auto mb-4 border-4 border-gray-300 shadow-lg"
              />
              <h2 className="text-3xl font-semibold">Shivang</h2>
              <p className="text-muted-foreground">AI Developer | Researcher</p>
              {/* Social Links */}
              <div className="mt-4 flex justify-center space-x-6">
                <a href="https://github.com/yourgithub" className="text-primary hover:scale-110 transition">
                  <FaGithub size={24} />
                </a>
                <a href="https://linkedin.com/in/yourlinkedin" className="text-blue-600 hover:scale-110 transition">
                  <FaLinkedin size={24} />
                </a>
                <a href="mailto:vats.jshivang@gmail.com" className="text-red-500 hover:scale-110 transition">
                  <FaEnvelope size={24} />
                </a>
                <a href="/path-to-resume.pdf" className="text-gray-700 hover:scale-110 transition">
                  <FaFileAlt size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects & Research Section */}
      <div className="bg-white py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-8">Projects & Research</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
  {projects.map((project, index) => (
    <motion.div 
    key={index}
    className="bg-gray-100 shadow-md rounded-lg p-4 hover:scale-102 transition cursor-pointer"
    whileHover={{ scale: 1.02 }}
  >
    <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
    <p className="text-base text-muted-foreground">{project.description}</p>
    <a 
      href={project.link} 
      className="text-blue-600 text-sm mt-2 inline-block hover:underline"
    >
      About Project →
    </a>
  </motion.div>
  
  ))}
</div>
      </div>

      {/* Tech Stack & Tools Section */}
      <div className="bg-white py-16 px-8 overflow-hidden">
        <h2 className="text-4xl font-bold text-center mb-8">Tech Stack & Tools</h2>
        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex space-x-24 w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...techStack, ...techStack].map((tech, index) => (
              <div key={index} className="flex flex-col items-center text-xl font-semibold">
                {tech.icon}
                <span className="mt-2">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutSection;
