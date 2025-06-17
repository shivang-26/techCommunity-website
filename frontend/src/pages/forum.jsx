import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaRegComment } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '../context/Usercontext'; // Assuming this hook exists

const Forum = () => {
  const [sortOption, setSortOption] = useState('Active');
  const [newQuestionTitle, setNewQuestionTitle] = useState(''); // State for new question title
  const [newQuestionContent, setNewQuestionContent] = useState(''); // State for new question content
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

  // Client-side sorting (optional, backend can also sort)
  const sortThreads = (threads, sortOption) => {
    switch (sortOption) {
      case 'Unanswered':
        return threads.filter(thread => thread.answers.length === 0);
      case 'Trending':
        // Assuming 'votes' are part of the backend response
        return [...threads].sort((a, b) => b.votes - a.votes);
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
  const handleVote = (threadId) => {
    // TODO: Implement backend logic for voting
    console.log('Vote clicked for thread:', threadId);
    const updatedThreads = threads.map(thread =>
      // Note: This is client-side only. Implement backend logic to persist votes.
      thread._id === threadId ? { ...thread, votes: (thread.votes || 0) + 1 } : thread
    );
    setThreads(updatedThreads);
  };

  const toggleAnswerBox = (threadId) => {
    setExpandedAnswer(prev => (prev === threadId ? null : threadId));
  };

  // Handle posting an answer (will need backend implementation)
  const handlePostAnswer = (threadId) => {
    // TODO: Implement backend logic for answers
    if (newAnswer.trim() === '') return;
    console.log(`Posting answer for thread ${threadId}:`, newAnswer);
    // const updatedThreads = threads.map(thread => {
    //   if (thread._id === threadId) {
    //     return {
    //       ...thread,
    //       answers: [...thread.answers, { user: user.name, answer: newAnswer }]
    //     };
    //   }
    //   return thread;
    // });
    // setThreads(updatedThreads);
    // setNewAnswer('');
    // setExpandedAnswer(null);
    alert('Posting answers is not yet implemented on the backend.');
  };

  if (loading || userLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading forum...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white p-6 pt-28 overflow-y-auto">
      {/* Sorting and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <select onChange={handleSortChange} value={sortOption} className="px-4 py-2 border rounded-md text-sm w-full md:w-1/4">
          <option value="Active">Latest</option>
          {/* Add other sorting options if needed based on backend capabilities */}
          {/* <option value="Unanswered">Unanswered</option>
          <option value="Trending">Trending</option> */}
        </select>
        {/* Search input - client-side search on fetched data or send search query to backend */}
        <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-md text-sm w-full md:w-2/4" />
      </div>

      {/* Post a New Question - Only shown if logged in */}
      {isLoggedIn && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Ask a New Question</h3>
          <input
            type="text"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            placeholder="Question Title"
            className="w-full px-4 py-2 border rounded-md text-sm mb-3"
            required
          />
          <textarea
            value={newQuestionContent}
            onChange={(e) => setNewQuestionContent(e.target.value)}
            placeholder="Provide details for your question..."
            className="w-full px-4 py-3 border rounded-md text-sm mb-4"
            rows="4"
            required
          />
          <button
            onClick={handlePostQuestion}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Post Question
          </button>
        </div>
      )}

      {/* Message if not logged in */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 border rounded-md bg-yellow-50 text-yellow-800">
          Please <a href="/login" className="underline">log in</a> to post a new question.
        </div>
      )}

      {/* Thread List */}
      <div className="space-y-8">
        {sortThreads(threads, sortOption).map((thread) => (
          <div className="pb-6 border-b last:border-b-0" key={thread._id}> {/* Use _id from backend */}
            {/* Question Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{thread.title}</h3>

            {/* Username and Timestamp */}
            {/* Access user.name from the populated user object */}
            <div className="text-sm text-gray-600 mb-3">
              Posted by: <span className="font-medium">{thread.user ? thread.user.name : 'Anonymous'}</span> on {new Date(thread.createdAt).toLocaleDateString()}
            </div>

            {/* Content */}
            <p className="text-gray-800 mt-2">{thread.content}</p>

            {/* Tags (if implemented) */}
            {/* <div className="space-x-2 mt-3">
              {thread.tags && thread.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div> */}

            {/* Votes and Answer Buttons */}
            <div className="flex space-x-6 mt-4 text-gray-600">
              {/* Voting is client-side only in this version, needs backend */}
              <button onClick={() => handleVote(thread._id)} className="flex items-center hover:text-blue-600 transition-colors duration-200">
                <FaThumbsUp className="mr-2" />
                <span>{thread.votes || 0}</span>
              </button>
              {isLoggedIn && (
                <button onClick={() => toggleAnswerBox(thread._id)} className="flex items-center hover:text-blue-600 transition-colors duration-200">
                  <FaRegComment className="mr-2" />
                  <span>{thread.answers ? thread.answers.length : 0}</span>
                </button>
              )}
            </div>

            {/* Marked as Answered (if implemented) */}
            {/* {thread.answered && <div className="text-green-600 mt-2">✅ Marked as Answered</div>} */}

            {/* Answers Section (placeholder) */}
            <div className="mt-4 space-y-4">
              {/* TODO: Fetch and display answers from backend */}
              {thread.answers && thread.answers.length > 0 ? (
                thread.answers.map((answer, index) => (
                  // This assumes answers are structured with user and answer fields, need to confirm backend structure for replies
                  // Placeholder structure:
                  <div key={index} className="bg-gray-100 p-3 rounded-md">
                    <div className="text-sm text-gray-600">Answered by: {answer.user ? answer.user.name : 'Anonymous'}</div>
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

      {/* Pagination Controls (Placeholder) */}
      {/* <div className="flex justify-center mt-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mx-2">Previous</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mx-2">Next</button>
      </div> */}
    </div>
  );
};

export default Forum;
