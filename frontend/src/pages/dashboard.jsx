import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/Usercontext";
import { FaChevronDown, FaChevronUp, FaRegCommentDots, FaThumbsUp, FaTrash } from 'react-icons/fa';

const DEFAULT_IMAGE = "https://www.w3schools.com/howto/img_avatar.png";
const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(DEFAULT_IMAGE);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [postContent, setPostContent] = useState("");
  const [activityFeed, setActivityFeed] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [uploading, setUploading] = useState(false);

  const profilePicUrl = user && (user._id || user.id) ? `/api/auth/profile-picture/${user._id || user.id}` : DEFAULT_IMAGE;

  const fetchUser = async () => {
    try {
      const response = await axios
        .get("/api/auth/me", { withCredentials: true })
        .then((res) => {
          console.log("User data:", res.data.user);
          console.log("Profile picture URL:", profilePicUrl);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUserQuestions();
    // eslint-disable-next-line
  }, [user]);

  const fetchUserQuestions = async () => {
    if (!user?._id && !user?.id) return;
    try {
      const res = await axios.get("/api/forum");
      // Filter questions posted by the logged-in user
      const myQuestions = res.data.filter(q => q.user && (q.user._id === (user._id || user.id) || q.user.id === (user._id || user.id)));
      setUserQuestions(myQuestions);
      // Filter questions where the user has answered
      const myAnswered = res.data.filter(q =>
        q.answers && q.answers.some(ans => ans.user && (ans.user._id === (user._id || user.id) || ans.user.id === (user._id || user.id)))
      );
      setAnsweredQuestions(myAnswered);
    } catch (err) {
      setUserQuestions([]);
      setAnsweredQuestions([]);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const response = await axios.post("/api/auth/upload-profile-pic", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.user?.hasProfilePicture) {
        setProfilePic(`/api/auth/profile-picture/${response.data.user._id || response.data.user.id}`);
      }
      if (response.data.user) {
        window.location.reload();
      }
      setMessage("Profile picture updated successfully!");
      setError("");
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload profile picture");
      setMessage("");
    } finally {
      setUploading(false);
    }
  };

  const handlePostUpdate = async () => {
    setPostContent("");
  };

  const toggleAnswers = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`/api/forum/${questionId}`);
      setUserQuestions(userQuestions.filter(q => q._id !== questionId));
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  const handleDeleteAnswer = async (postId, answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;
    try {
      await axios.delete(`/api/forum/${postId}/answer/${answerId}`, { withCredentials: true });
      // Refresh questions after deletion
      fetchUserQuestions();
    } catch (err) {
      alert('Failed to delete answer.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Dashboard Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 md:gap-0">
        <h2 className="text-xl md:text-2xl font-bold text-black text-left">Profile</h2>
        {/* Edit Profile Button */}
        <button
          onClick={() => navigate("/change-password")}
          className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
        >
          Change Password
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-6 mb-8">
        {/* Profile Picture with Upload Option */}
        <div className="relative w-24 h-24 flex-shrink-0 cursor-pointer">
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-full h-full rounded-full border-2 border-white object-cover"
            onClick={() => !uploading && fileInputRef.current.click()}
            style={{ opacity: uploading ? 0.5 : 1 }}
            onError={(e) => {
              console.error("Profile picture failed to load:", profilePicUrl);
              console.error("Error event:", e);
              e.target.src = DEFAULT_IMAGE;
            }}
            onLoad={() => {
              console.log("Profile picture loaded successfully:", profilePicUrl);
            }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfilePicUpload}
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="ml-2 text-blue-700 font-semibold">Uploading...</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Activity Section */}
      <h2 className="text-3xl font-bold mb-6">Activity</h2>
      {/* Post Update Box */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-100">
        <textarea
          className="w-full border border-blue-200 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          rows={3}
          placeholder={`What's new, ${user?.username || user?.email || 'user'}?`}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition"
          onClick={handlePostUpdate}
        >
          Post Update
        </button>
      </div>
      {/* User's Forum Questions */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-6 text-blue-700 flex items-center gap-2">
          <FaRegCommentDots className="text-blue-500" /> Your Forum Questions
        </h3>
        {userQuestions.length === 0 ? (
          <div className="text-gray-500">You haven't posted any questions yet.</div>
        ) : (
          userQuestions.map((q) => (
            <div key={q._id} className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={q.user && (q.user._id || q.user.id) ? `/api/auth/profile-picture/${q.user._id || q.user.id}` : DEFAULT_AVATAR}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-semibold text-lg text-blue-800">{q.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                    onClick={() => toggleAnswers(q._id)}
                  >
                    {expandedQuestion === q._id ? <FaChevronUp /> : <FaChevronDown />}
                    {expandedQuestion === q._id ? 'Hide Answers' : 'Show Answers'}
                  </button>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 text-lg p-1 rounded focus:outline-none"
                    title="Delete Question"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="text-gray-700 mb-2">{q.content}</div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <span>Posted on {new Date(q.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><FaRegCommentDots /> {q.answers?.length || 0} Answers</span>
                <span className="flex items-center gap-1"><FaThumbsUp /> {q.votes || 0} Votes</span>
              </div>
              {expandedQuestion === q._id && (
                <div className="mt-4 space-y-3">
                  {q.answers && q.answers.length > 0 ? (
                    q.answers.map((answer, idx) => {
                      console.log('Dashboard answer:', answer);
                      return (
                        <div key={idx} className={`p-3 rounded border-l-4 ${(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) ? 'bg-green-50 border-green-400' : 'bg-blue-50 border-blue-400'}`}>
                          <div className={`flex items-center gap-2 text-xs mb-1 ${(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) ? 'text-green-700' : 'text-blue-700'}`}>
                            <img
                              src={answer.user && (answer.user._id || answer.user.id) ? `/api/auth/profile-picture/${answer.user._id || answer.user.id}` : DEFAULT_AVATAR}
                              alt="Profile"
                              className="w-5 h-5 rounded-full object-cover border border-gray-300"
                            />
                            <span>Answered by: <span className="font-medium">{answer.user?.username || 'Anonymous'}</span>{answer.createdAt && <> on {new Date(answer.createdAt).toLocaleDateString()}</>}</span>
                            {/* Delete button for user's own answers */}
                            {(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) && (
                              <button
                                className="ml-2 text-red-500 hover:text-red-700 text-xs p-1 rounded focus:outline-none"
                                title="Delete Answer"
                                onClick={() => handleDeleteAnswer(q._id, answer.id || answer._id)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                          <div className="text-gray-800">{answer.answer}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-sm">No answers yet.</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Questions Answered by User */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-6 text-green-700 flex items-center gap-2">
          <FaRegCommentDots className="text-green-500" /> Questions You Answered
        </h3>
        {answeredQuestions.length === 0 ? (
          <div className="text-gray-500">You haven't answered any questions yet.</div>
        ) : (
          answeredQuestions.map((q) => (
            <div key={q._id} className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={q.user && (q.user._id || q.user.id) ? `/api/auth/profile-picture/${q.user._id || q.user.id}` : DEFAULT_AVATAR}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-semibold text-lg text-green-800">{q.title}</span>
                </div>
                <button
                  className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium focus:outline-none"
                  onClick={() => toggleAnswers(q._id)}
                >
                  {expandedQuestion === q._id ? <FaChevronUp /> : <FaChevronDown />}
                  {expandedQuestion === q._id ? 'Hide Answers' : 'Show Answers'}
                </button>
              </div>
              <div className="text-gray-700 mb-2">{q.content}</div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <span>Posted on {new Date(q.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><FaRegCommentDots /> {q.answers?.length || 0} Answers</span>
                <span className="flex items-center gap-1"><FaThumbsUp /> {q.votes || 0} Votes</span>
              </div>
              {expandedQuestion === q._id && (
                <div className="mt-4 space-y-3">
                  {q.answers && q.answers.length > 0 ? (
                    q.answers.map((answer, idx) => {
                      console.log('Dashboard answer:', answer);
                      return (
                        <div key={idx} className={`p-3 rounded border-l-4 ${(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) ? 'bg-green-50 border-green-400' : 'bg-blue-50 border-blue-400'}`}>
                          <div className={`flex items-center gap-2 text-xs mb-1 ${(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) ? 'text-green-700' : 'text-blue-700'}`}>
                            <img
                              src={answer.user && (answer.user._id || answer.user.id) ? `/api/auth/profile-picture/${answer.user._id || answer.user.id}` : DEFAULT_AVATAR}
                              alt="Profile"
                              className="w-5 h-5 rounded-full object-cover border border-gray-300"
                            />
                            <span>Answered by: <span className="font-medium">{answer.user?.username || 'Anonymous'}</span>{answer.createdAt && <> on {new Date(answer.createdAt).toLocaleDateString()}</>}</span>
                            {/* Delete button for user's own answers */}
                            {(answer.user?._id === (user?._id || user?.id) || answer.user?.id === (user?._id || user?.id)) && (
                              <button
                                className="ml-2 text-red-500 hover:text-red-700 text-xs p-1 rounded focus:outline-none"
                                title="Delete Answer"
                                onClick={() => handleDeleteAnswer(q._id, answer.id || answer._id)}
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
                          <div className="text-gray-800">{answer.answer}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-sm">No answers yet.</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Post = ({ name, comment, time }) => (
  <div className="border p-3 md:p-4 rounded-lg shadow bg-white">
    <div className="flex items-center mb-2">
      <img
        src="https://randomuser.me/api/portraits/men/45.jpg"
        alt="user"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3"
      />
      <div>
        <p className="font-medium text-sm md:text-base">{name}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <p className="text-sm">{comment}</p>
    <div className="mt-2 flex gap-3 text-sm text-gray-500">
      <button className="hover:text-[#2563eb]">⭐ Favorite</button>
      <button className="hover:text-red-500">🗑 Delete</button>
    </div>
  </div>
);

export default Dashboard;
