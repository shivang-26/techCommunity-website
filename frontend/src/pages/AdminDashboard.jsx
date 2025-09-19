import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/Usercontext';
import axios from 'axios';

const sections = [
  { key: 'analytics', label: 'Analytics' },
  { key: 'users', label: 'Users' },
  { key: 'forum', label: 'Forum' },
  { key: 'activity', label: 'Activity' },
  { key: 'top-content', label: 'Top Content' },
  { key: 'content', label: 'Content' },
];

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  
  // Users state
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({});
  const [userSearch, setUserSearch] = useState('');
  
  // Forum state
  const [forumPosts, setForumPosts] = useState([]);
  const [forumPagination, setForumPagination] = useState({});
  const [forumSearch, setForumSearch] = useState('');

  // Activity state
  const [activities, setActivities] = useState([]);

  // Top content state
  const [topContent, setTopContent] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeSection === 'analytics') {
      fetchAnalytics();
    } else if (activeSection === 'users') {
      fetchUsers();
    } else if (activeSection === 'forum') {
      fetchForumPosts();
    } else if (activeSection === 'activity') {
      fetchActivity();
    } else if (activeSection === 'top-content') {
      fetchTopContent();
    }
  }, [activeSection]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/analytics', { withCredentials: true });
      setAnalytics(response.data);
    } catch (error) {
      setError('Failed to fetch analytics');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/users', {
        params: { page, limit: 10, search },
        withCredentials: true
      });
      setUsers(response.data.users);
      setUserPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForumPosts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/forum/posts', {
        params: { page, limit: 10, search },
        withCredentials: true
      });
      setForumPosts(response.data.posts);
      setForumPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to fetch forum posts');
      console.error('Forum posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      setSuccess('User role updated successfully');
      fetchUsers(userPagination.page, userSearch);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update user role');
      console.error('Update user role error:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
        setSuccess('User deleted successfully');
        fetchUsers(userPagination.page, userSearch);
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete user');
        console.error('Delete user error:', error);
      }
    }
  };

  const deleteForumPost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/admin/forum/posts/${postId}`, { withCredentials: true });
        setSuccess('Post deleted successfully');
        fetchForumPosts(forumPagination.page, forumSearch);
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete post');
        console.error('Delete post error:', error);
      }
    }
  };

  const handleUserSearch = (e) => {
    const search = e.target.value;
    setUserSearch(search);
    fetchUsers(1, search);
  };

  const handleForumSearch = (e) => {
    const search = e.target.value;
    setForumSearch(search);
    fetchForumPosts(1, search);
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/activity', { withCredentials: true });
      setActivities(response.data.activities);
    } catch (error) {
      setError('Failed to fetch activity logs');
      console.error('Activity error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopContent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/top-content', { withCredentials: true });
      setTopContent(response.data);
    } catch (error) {
      setError('Failed to fetch top content');
      console.error('Top content error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.users?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Admin Users</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.users?.admins || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Posts</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics?.forum?.totalPosts || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Answers</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics?.forum?.totalAnswers || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent User Growth</h3>
          <div className="space-y-2">
            {analytics?.users?.growth?.slice(-7).map((day) => (
              <div key={day._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{day._id}</span>
                <span className="font-medium">{day.count} users</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Forum Activity</h3>
          <div className="space-y-2">
            {analytics?.forum?.activity?.slice(-7).map((day) => (
              <div key={day._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{day._id}</span>
                <div className="space-x-4">
                  <span className="text-blue-600">{day.posts} posts</span>
                  <span className="text-green-600">{day.answers} answers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-lg w-64"
          value={userSearch}
          onChange={handleUserSearch}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profilePicture && typeof user.profilePicture === 'string' ? (
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={user.profilePicture.startsWith('data:') ? user.profilePicture : `data:image/jpeg;base64,${user.profilePicture}`} 
                          alt={user.username}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">{user.username.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    className={`px-2 py-1 rounded text-sm ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {userPagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: userPagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchUsers(page, userSearch)}
              className={`px-3 py-1 rounded ${userPagination.page === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderForum = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search posts..."
          className="px-4 py-2 border rounded-lg w-64"
          value={forumSearch}
          onChange={handleForumSearch}
        />
      </div>
      
      <div className="space-y-4">
        {forumPosts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.content ? post.content.substring(0, 200) + '...' : 'No content available'}</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <span>By {post.user?.username}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.votes} votes</span>
                  <span className="mx-2">•</span>
                  <span>{post.answers?.length || 0} answers</span>
                </div>
              </div>
              <button
                onClick={() => deleteForumPost(post._id)}
                className="ml-4 text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {forumPagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: forumPagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchForumPosts(page, forumSearch)}
              className={`px-3 py-1 rounded ${forumPagination.page === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                activity.type === 'user_registration' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTopContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Voted Posts</h3>
          <div className="space-y-4">
            {topContent?.topPosts?.map((post, index) => (
              <div key={post._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-600">{post.votes} votes</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{post.content ? post.content.substring(0, 100) + '...' : 'No content available'}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>By {post.user?.username}</span>
                  <span className="mx-2">•</span>
                  <span>{post.answers?.length || 0} answers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Answered Posts</h3>
          <div className="space-y-4">
            {topContent?.mostAnswered?.map((post, index) => (
              <div key={post._id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-600">{post.answers?.length || 0} answers</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{post.content ? post.content.substring(0, 100) + '...' : 'No content available'}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>By {post.user?.username}</span>
                  <span className="mx-2">•</span>
                  <span>{post.votes} votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {(() => {
          switch (activeSection) {
            case 'analytics':
              return renderAnalytics();
            case 'users':
              return renderUsers();
            case 'forum':
              return renderForum();
            case 'activity':
              return renderActivity();
            case 'top-content':
              return renderTopContent();
            case 'content':
              return (
                <div>
                  <h1 className="text-2xl font-bold mb-4">Site Content Management</h1>
                  <div className="text-gray-500">(Content management features coming soon)</div>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r p-6 flex flex-col gap-4 shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-blue-700">Admin</h2>
        {sections.map((section) => (
          <button
            key={section.key}
            className={`text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === section.key
                ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </button>
        ))}
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;