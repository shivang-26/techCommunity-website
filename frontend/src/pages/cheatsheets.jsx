import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import Footer from "../components/footer";

const cheatSheets = [
  { title: "Python Basics", category: "Programming", link: "/cheat-sheets/python-basics.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { title: "React Hooks", category: "Web Development", link: "/cheat-sheets/react-hooks.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { title: "TensorFlow Guide", category: "AI/ML", link: "/cheat-sheets/tensorflow-guide.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { title: "Linux Commands", category: "Operating Systems", link: "/cheat-sheets/linux-commands.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { title: "Git Cheat Sheet", category: "Version Control", link: "/cheat-sheets/git-cheat-sheet.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { title: "JavaScript ES6", category: "Programming", link: "/cheat-sheets/javascript-es6.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { title: "Docker Basics", category: "DevOps", link: "/cheat-sheets/docker-basics.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { title: "C++ Basics", category: "Programming", link: "/cheat-sheets/cplusplus-basics.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { title: "Java Essentials", category: "Programming", link: "/cheat-sheets/java-essentials.pdf", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow p-4 sm:p-8 mx-auto w-full max-w-screen-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Cheat Sheets</h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <input
            type="text"
            placeholder="Search cheat sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredSheets.length > 0 ? (
            filteredSheets.map((sheet, index) => {
              const isBookmarked = bookmarked[cheatSheets.indexOf(sheet)];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-300 py-3"
                >
                  {/* Left - Logo + Title */}
                  <div className="flex items-center gap-4">
                    <img src={sheet.logo} alt={sheet.title} className="w-8 h-8" />
                    <div>
                      <h2 className="text-md font-medium text-gray-800">{sheet.title}</h2>
                      <p className="text-sm text-gray-500">{sheet.category}</p>
                    </div>
                  </div>

                  {/* Right - View, Bookmark & Share */}
                  <div className="flex items-center gap-3">
                    <a
                      href={sheet.link}
                      target="_blank"
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      View
                    </a>
                    <button
                      onClick={() => toggleBookmark(cheatSheets.indexOf(sheet))}
                      className="hover:scale-110 transition"
                    >
                      <Bookmark className="w-5 h-5" fill={isBookmarked ? "black" : "none"} stroke="black" />
                    </button>
                    <button
                      onClick={() => handleShare(sheet.link)}
                      className="hover:scale-110 transition"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No cheat sheets found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
