import React, { useState } from 'react';
import { FaThumbsUp, FaRegComment } from 'react-icons/fa';

const initialThreads = [
  {
    id: 1,
    title: 'How to implement U-Net for image segmentation?',
    votes: 23,
    answers: [
      { user: 'john_doe', answer: 'You can start by reading the U-Net paper and using a pre-trained model to fine-tune it for your specific dataset.' },
      { user: 'jane_smith', answer: 'Consider using data augmentation techniques to improve the model performance.' }
    ],
    tags: ['U-Net', 'Image Segmentation'],
    answered: true,
    username: 'alice_123'
  },
  {
    id: 2,
    title: 'What is the best optimizer for GANs?',
    votes: 45,
    answers: [
      { user: 'mark_taylor', answer: 'Adam is commonly used, but try experimenting with RMSProp too.' }
    ],
    tags: ['GAN', 'Optimizer'],
    answered: false,
    username: 'bob_456'
  },
  {
    id: 3,
    title: 'Understanding Transformer-based Image Captioning',
    votes: 12,
    answers: [],
    tags: ['Transformer', 'Image Captioning'],
    answered: false,
    username: 'charlie_789'
  },
];

const Forum = () => {
  const [sortOption, setSortOption] = useState('Active');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for demo
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [expandedAnswer, setExpandedAnswer] = useState(null);
  const [threads, setThreads] = useState(initialThreads);
  const [username, setUsername] = useState('guest');

  const sortThreads = (threads, sortOption) => {
    switch (sortOption) {
      case 'Unanswered':
        return threads.filter(thread => thread.answers.length === 0);
      case 'Trending':
        return [...threads].sort((a, b) => b.votes - a.votes);
      case 'Active':
      default:
        return [...threads].sort((a, b) => b.id - a.id);
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleVote = (threadId) => {
    const updatedThreads = threads.map(thread =>
      thread.id === threadId ? { ...thread, votes: thread.votes + 1 } : thread
    );
    setThreads(updatedThreads);
  };

  const toggleAnswerBox = (threadId) => {
    setExpandedAnswer(prev => (prev === threadId ? null : threadId));
  };

  const handlePostQuestion = () => {
    if (newQuestion.trim() === '') return;
    const newThread = {
      id: threads.length + 1,
      title: newQuestion,
      votes: 0,
      answers: [],
      tags: [],
      answered: false,
      username: username,
    };
    setThreads([newThread, ...threads]);
    setNewQuestion('');
  };

  const handlePostAnswer = (threadId) => {
    if (newAnswer.trim() === '') return;
    const updatedThreads = threads.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          answers: [...thread.answers, { user: username, answer: newAnswer }]
        };
      }
      return thread;
    });
    setThreads(updatedThreads);
    setNewAnswer('');
    setExpandedAnswer(null);
  };

  return (
    <div className="w-full min-h-screen bg-white p-6 pt-28 overflow-y-auto">
      {/* Sorting and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <select onChange={handleSortChange} value={sortOption} className="px-4 py-2 border rounded-md text-sm w-full md:w-1/4">
          <option value="Active">Active</option>
          <option value="Unanswered">Unanswered</option>
          <option value="Trending">Trending</option>
        </select>
        <input type="text" placeholder="Search by tags..." className="px-4 py-2 border rounded-md text-sm w-full md:w-2/4" />
      </div>

      {/* Post a New Question */}
      {isLoggedIn && (
        <div className="mb-6">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a new question..."
            className="w-full px-4 py-3 border rounded-md text-sm mb-4"
          />
          <button onClick={handlePostQuestion} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Post Question</button>
        </div>
      )}

      {/* Thread List */}
      {sortThreads(threads, sortOption).map((thread) => (
        <div className="mb-10 border-b pb-6" key={thread.id}>
          {/* Question Title */}
          <h3 className="text-lg font-semibold text-gray-800">{thread.title}</h3>

          {/* Username */}
          <div className="text-sm text-gray-600 mt-1">Posted by: {thread.username}</div>

          {/* Tags */}
          <div className="space-x-2 mt-2">
            {thread.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Votes and Answer Buttons */}
          <div className="flex space-x-6 mt-4 text-gray-600">
            <button onClick={() => handleVote(thread.id)} className="flex items-center hover:text-blue-600">
              <FaThumbsUp className="mr-2" />
              <span>{thread.votes}</span>
            </button>
            {isLoggedIn && (
              <button onClick={() => toggleAnswerBox(thread.id)} className="flex items-center hover:text-blue-600">
                <FaRegComment className="mr-2" />
                <span>{thread.answers.length}</span>
              </button>
            )}
          </div>

          {/* Marked as Answered */}
          {thread.answered && <div className="text-green-600 mt-2">✅ Marked as Answered</div>}

          {/* Answers Section */}
          <div className="mt-4 space-y-4">
            {thread.answers.length > 0 ? (
              thread.answers.map((answer, index) => (
                <div key={index}>
                  <div className="text-sm text-gray-600">Answered by: {answer.user}</div>
                  <p className="text-gray-800">{answer.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No answers yet.</div>
            )}
          </div>

          {/* Post Answer Box */}
          {isLoggedIn && expandedAnswer === thread.id && (
            <div className="mt-6">
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer..."
                className="w-full px-4 py-3 border rounded-md text-sm mb-4"
              />
              <button onClick={() => handlePostAnswer(thread.id)} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">Post Answer</button>
            </div>
          )}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mx-2">Previous</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mx-2">Next</button>
      </div>
    </div>
  );
};

export default Forum;
