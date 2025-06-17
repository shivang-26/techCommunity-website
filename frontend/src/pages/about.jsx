import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTensorflow, SiPytorch, SiDocker, SiGit } from "react-icons/si";
import profile from "../assets/profile.jpeg";
import Footer from "../components/footer";
import { Link } from 'react-router-dom';

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
    link: "#"
  },
  {
    title: "Mental Health Chatbot",
    description: "AI-powered chatbot using ML, DL, NLP for text-based mental health assistance. Try it live!",
    link: "/chatbot",
    isLive: true
  },
  {
    title: "UnifiedHands – AI-Powered Community Support Platform",
    description: "AI-based web app leveraging image and text analysis for social impact.",
    link: "#"
  },
  {
    title: "Appointlet – Intelligent Scheduling System",
    description: "AI-driven patient appointment scheduling system.",
    link: "#"
  }
];

const AboutSection = () => {
  return (
    <div>
      {/* About Platform Section */}
      <div className="bg-gray-100 text-foreground py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              About <span className="text-blue-600">TechConnect</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              At TechConnect, we believe in the power of collaboration to drive AI innovation. Our mission is to create a space where AI enthusiasts, developers, and researchers can connect, share knowledge, and develop groundbreaking AI solutions together.
            </p>
          </motion.div>

          {/* Platform Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-3">Community Learning</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of AI enthusiasts, share knowledge, and learn from peers through interactive discussions and resource sharing.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-3">AI Innovation</h3>
              <p className="text-muted-foreground">
                Access cutting-edge AI tools, collaborate on projects, and stay updated with the latest developments in artificial intelligence.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-3">Resource Hub</h3>
              <p className="text-muted-foreground">
                Explore our comprehensive collection of AI resources, tutorials, and tools to enhance your learning journey.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* About Developer Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About the Developer</h2>
          
          {/* Developer Profile */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <motion.div 
              className="md:w-1/3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
                <img 
                  src={profile}
                  alt="Developer Profile" 
                  className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-gray-300 shadow-lg"
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

            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-4">Professional Journey</h3>
              <p className="text-muted-foreground mb-6">
                I am a passionate AI developer and researcher with expertise in machine learning, deep learning, and natural language processing. My focus is on creating innovative AI solutions that make a positive impact on society.
              </p>
              <p className="text-muted-foreground mb-6">
                With a strong foundation in both theoretical and practical aspects of AI, I strive to bridge the gap between research and real-world applications. My work spans across various domains including healthcare, education, and social impact.
              </p>
              <p className="text-muted-foreground">
                I believe in the power of open collaboration and knowledge sharing, which is why I created TechConnect - a platform for AI enthusiasts to learn, grow, and innovate together.
              </p>
            </motion.div>
          </div>

          {/* Projects Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">Featured Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-100 shadow-md rounded-lg p-6 hover:scale-102 transition cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  {project.isLive ? (
                    <Link 
                      to={project.link}
                      className="inline-flex items-center text-blue-600 text-sm hover:underline"
                    >
                      Try it Live →
                    </Link>
                  ) : (
                    <a 
                      href={project.link} 
                      className="text-blue-600 text-sm inline-block hover:underline"
                    >
                      About Project →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="overflow-hidden">
            <h3 className="text-3xl font-bold text-center mb-8">Tech Stack & Tools</h3>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutSection;
