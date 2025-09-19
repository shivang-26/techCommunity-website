import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaRegComment, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '../context/Usercontext'; // Assuming this hook exists

// Default avatar image for users without profile pictures
const DEFAULT_AVATAR = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=U';

const Forum = () => {
  const [sortOption, setSortOption] = useState('Active');
  const [newQuestionTitle, setNewQuestionTitle] = useState(''); // State for new question title
  const [newQuestionContent, setNewQuestionContent] = useState(''); // State for new question content
  const [newAnswer, setNewAnswer] = useState(''); // State for new answer
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const [threads, setThreads] = useState([]); // Use state for fetched threads
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const { user, loading: userLoading } = useUser(); // Get user from context
  const isLoggedIn = !!user; // Determine login status

  // Add console logs here
  useEffect(() => {
    console.log('Forum Component Mounted:');
    console.log('  Initial User:', user);
    console.log('  Initial User Loading:', userLoading);
    console.log('  Initial Is Logged In:', isLoggedIn);

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/forum');
        setThreads(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching forum posts:', err);
        setError('Failed to fetch forum posts.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  // Add console logs before render
  console.log('Forum Component Rendering:');
  console.log('  Current User:', user);
  console.log('  Current User Loading:', userLoading);
  console.log('  Current Is Logged In:', isLoggedIn);
  console.log('  Current Forum Loading:', loading);

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Client-side sorting (optional, backend can also sort)
  const sortThreads = (threads, sortOption) => {
    switch (sortOption) {
      case 'Unanswered':
        return threads.filter(thread => thread.answers && thread.answers.length === 0);
      case 'Trending':
        // Assuming 'votes' are part of the backend response
        return [...threads].sort((a, b) => (b.votes || 0) - (a.votes || 0));
      case 'Active':
      default:
        // Assuming 'createdAt' is available for sorting by recent
        return [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Handle posting a new question
  const handlePostQuestion = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to post a question.');
      return;
    }
    if (newQuestionTitle.trim() === '' || newQuestionContent.trim() === '') {
      alert('Please enter both title and content for your question.');
      return;
    }

    try {
      // Send post data to the backend
      await axios.post('/api/forum', {
        title: newQuestionTitle,
        content: newQuestionContent
      }, { withCredentials: true }); // Send cookies for authentication

      // Clear form and refetch posts
      setNewQuestionTitle('');
      setNewQuestionContent('');
      // Refetch posts after successful creation
      const res = await axios.get('/api/forum');
      setThreads(res.data);

    } catch (err) {
      console.error('Error posting question:', err);
      alert('Failed to post question. Please try again.');
    }
  };

  // Handle voting (client-side for now, can be moved to backend)
  const handleVote = async (threadId) => {
    if (!isLoggedIn) {
      alert('You must be logged in to vote.');
      return;
    }

    try {
      const response = await axios.put(`/api/forum/${threadId}/vote`, {}, { withCredentials: true });
      
      // Update the specific thread with the new vote count
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread._id === threadId ? response.data : thread
        )
      );
    } catch (err) {
      console.error('Error voting on post:', err);
      if (err.response?.status === 400) {
        alert(err.response.data.message); // Show "You have already voted" message
      } else {
        alert('Failed to vote. Please try again.');
      }
    }
  };

  const toggleAnswerBox = (threadId) => {
    setExpandedAnswer(prev => (prev === threadId ? null : threadId));
    // Clear the answer input when toggling
    if (expandedAnswer === threadId) {
      setNewAnswer('');
    }
  };

  // Handle posting an answer (will need backend implementation)
  const handlePostAnswer = async (threadId) => {
    if (!isLoggedIn) {
      alert('You must be logged in to post an answer.');
      return;
    }
    
    if (newAnswer.trim() === '') {
      alert('Please enter an answer.');
      return;
    }

    try {
      const response = await axios.post(`/api/forum/${threadId}/answer`, 
        { answer: newAnswer }, 
        { withCredentials: true }
      );
      
      // Update the specific thread with the new answer
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread._id === threadId ? response.data : thread
        )
      );
      
      // Clear the answer input and close the answer box
      setNewAnswer('');
      setExpandedAnswer(null);
    } catch (err) {
      console.error('Error posting answer:', err);
      alert('Failed to post answer. Please try again.');
    }
  };

  // Handle deleting an answer
  const handleDeleteAnswer = async (postId, answerId) => {
    if (!isLoggedIn) {
      alert('You must be logged in to delete an answer.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/forum/${postId}/answer/${answerId}`, 
        { withCredentials: true }
      );
      
      // Update the specific thread with the updated answers
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread._id === postId ? response.data : thread
        )
      );
    } catch (err) {
      console.error('Error deleting answer:', err);
      if (err.response?.status === 403) {
        alert('You are not authorized to delete this answer.');
      } else {
        alert('Failed to delete answer. Please try again.');
      }
    }
  };

  if (loading || userLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading forum...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Sorting and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <select onChange={handleSortChange} value={sortOption} className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Active">Latest</option>
          </select>
          <input type="text" placeholder="Search..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-2/4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        {/* Post a New Question - Only shown if logged in */}
        {isLoggedIn && (
          <div className="mb-10 p-8 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Ask a New Question
              <span className="flex-1 border-b border-gray-200 ml-2"></span>
            </h3>
            <input
              type="text"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              placeholder="Question Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <textarea
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              placeholder="Provide details for your question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows="4"
              required
            />
            <button
              onClick={handlePostQuestion}
              className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition-colors duration-200"
            >
              Post Question
            </button>
          </div>
        )}
        {/* Message if not logged in */}
        {!isLoggedIn && (
          <div className="mb-10 p-6 border rounded-xl bg-yellow-50 text-yellow-800 text-center">
            Please <a href="/login" className="underline">log in</a> to post a new question.
          </div>
        )}
        {/* Thread List */}
        <div className="space-y-6">
          {sortThreads(threads, sortOption).map((thread) => (
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition" key={thread._id}>
              {/* Question Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{thread.title}</h3>
              {/* Username and Timestamp */}
              <div className="text-sm text-gray-600 mb-3">
                Posted by:
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={thread.user && (thread.user._id || thread.user.id) ? `/api/auth/profile-picture/${thread.user._id || thread.user.id}` : DEFAULT_AVATAR}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-gray-300"
                  />
                  <span className="font-medium">{thread.user ? thread.user.username : 'Anonymous'}</span> on {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </div>
              {/* Content */}
              {thread.content && <p className="text-gray-800 mt-2 mb-4">{thread.content}</p>}
              {/* Votes and Answer Buttons */}
              <div className="flex space-x-6 mt-4 text-gray-600">
                <button 
                  onClick={() => handleVote(thread._id)} 
                  className={`flex items-center transition-colors duration-200 px-3 py-1 rounded hover:bg-blue-50 ${
                    thread.votedBy && thread.votedBy.some(voter => voter._id === user?._id)
                      ? 'text-blue-600 bg-blue-100'
                      : 'hover:text-blue-600'
                  }`}
                >
                  <FaThumbsUp className="mr-2" />
                  <span>{thread.votes || 0}</span>
                </button>
                {isLoggedIn && (
                  <button onClick={() => toggleAnswerBox(thread._id)} className="flex items-center px-3 py-1 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                    <FaRegComment className="mr-2" />
                    <span>{thread.answers ? thread.answers.length : 0}</span>
                  </button>
                )}
              </div>
              {/* Answers Section */}
              <div className="mt-6 space-y-4">
                {thread.answers && thread.answers.length > 0 ? (
                  thread.answers.map((answer, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-400">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <img
                            src={answer.user && (answer.user._id || answer.user.id) ? `/api/auth/profile-picture/${answer.user._id || answer.user.id}` : DEFAULT_AVATAR}
                            alt="Profile"
                            className="w-5 h-5 rounded-full object-cover border border-gray-300"
                          />
                          <span>Answered by: <span className="font-medium">{answer.user ? answer.user.username : 'Anonymous'}</span> on {new Date(answer.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Show delete button only if the answer belongs to the current user */}
                        {isLoggedIn && answer.user && (answer.user._id === (user?._id || user?.id) || answer.user.id === (user?._id || user?.id)) && (
                          <button
                            onClick={() => handleDeleteAnswer(thread._id, answer._id || answer.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Delete answer"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-800">{answer.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No answers yet.</div>
                )}
              </div>
              {/* Post Answer Box (Only shown if logged in and expanded) */}
              {isLoggedIn && expandedAnswer === thread._id && (
                <div className="mt-6 p-4 border rounded-md bg-white">
                  <h4 className="font-semibold mb-2">Post Your Answer</h4>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                    className="w-full px-4 py-3 border rounded-md text-sm mb-4"
                    rows="3"
                  />
                  <button
                    onClick={() => handlePostAnswer(thread._id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Post Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
