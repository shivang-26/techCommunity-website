import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/footer";

const cheatSheets = [
  { title: "Python Basics", category: "Programming", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { title: "React Hooks", category: "Web Development", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { title: "TensorFlow Guide", category: "AI/ML", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { title: "Linux Commands", category: "Operating Systems", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { title: "Git Cheat Sheet", category: "Version Control", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { title: "JavaScript ES6", category: "Programming", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { title: "Docker Basics", category: "DevOps", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { title: "C++ Basics", category: "Programming", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { title: "Java Essentials", category: "Programming", link: "#", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
];

export default function CheatSheetsPage() {
  const [bookmarked, setBookmarked] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleBookmark = (index) => {
    setBookmarked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const categories = ["All", ...new Set(cheatSheets.map(sheet => sheet.category))];

  const filteredSheets = cheatSheets.filter(sheet =>
    (selectedCategory === "All" || sheet.category === selectedCategory) &&
    (sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedSheets = filteredSheets.sort((a, b) => (bookmarked[cheatSheets.indexOf(b)] ? 1 : 0) - (bookmarked[cheatSheets.indexOf(a)] ? 1 : 0));

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow w-full p-8 max-w-7xl mx-auto bg-gradient-to-r from-gray-100 to-gray-200">
        <h1 className="text-5xl font-bold text-center mb-6 text-blue-500">
          Cheat Sheets
        </h1>
        <p className="text-center text-gray-700 mb-8 text-lg">
          Boost your productivity with our quick reference guides.
        </p>

        {/* Search and Filter */}
        <div className="mb-6 flex justify-center gap-4">
          <input
            type="text"
            placeholder="Search cheat sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedSheets.length > 0 ? (
            sortedSheets.map((sheet, index) => {
              const isBookmarked = bookmarked[cheatSheets.indexOf(sheet)];

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center border border-gray-300 transition-transform duration-200 hover:shadow-xl"
                >
                  <img src={sheet.logo} alt={sheet.title} className="w-12 h-12 mb-2" />
                  <h2 className="text-lg font-semibold text-center text-gray-800">{sheet.title}</h2>
                  <span className="text-xs font-medium text-gray-700 mb-2">
                    {sheet.category}
                  </span>
                  <div className="flex justify-between w-full">
                    <a href={sheet.link} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full text-center text-sm">
                      View
                    </a>
                    <button 
                      className="p-2 ml-2 transform transition-transform duration-200 hover:scale-110" 
                      onClick={() => toggleBookmark(cheatSheets.indexOf(sheet))}
                    >
                      <Bookmark className="w-5 h-5" fill={isBookmarked ? "black" : "none"} stroke="black" />
                    </button>
                    <button 
                      className="p-2 ml-2 transform transition-transform duration-200 hover:scale-110" 
                      onClick={() => handleShare(sheet.link)}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-4">No cheat sheets found.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
