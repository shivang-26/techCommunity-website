import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/Usercontext';

const sections = [
  { key: 'analytics', label: 'Analytics' },
  { key: 'users', label: 'Users' },
  { key: 'forum', label: 'Forum' },
  { key: 'content', label: 'Content' },
];

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState('analytics');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect non-admins
    }
  }, [user, navigate]);

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
        {activeSection === 'analytics' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <div className="text-gray-500">(Analytics cards/charts will go here)</div>
          </div>
        )}
        {activeSection === 'users' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">User Moderation</h1>
            <div className="text-gray-500">(User list, ban/unban, warnings will go here)</div>
          </div>
        )}
        {activeSection === 'forum' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Forum Moderation</h1>
            <div className="text-gray-500">(Forum post/answer management will go here)</div>
          </div>
        )}
        {activeSection === 'content' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Site Content Management</h1>
            <div className="text-gray-500">(Edit About page, banners, etc. will go here)</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 