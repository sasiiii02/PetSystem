import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Heart, X, Trash2, Search } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores user ID for deletion
  const navigate = useNavigate();

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched users:', response.data); // Log to inspect data
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Error fetching users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = users.filter((user) => {
      // Safely handle undefined or non-string name/email
      const name = typeof user.name === 'string' ? user.name.toLowerCase() : '';
      const email = typeof user.email === 'string' ? user.email.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Handle delete profile
  const handleDeleteProfile = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `http://localhost:5000/api/users/deleteProfile/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === 'Profile deleted successfully') {
        setUsers(users.filter((user) => user._id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete profile');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Error deleting profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-amber-950">
          <div className="w-6 h-6 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-[1300px] bg-white shadow-2xl rounded-2xl p-6 sm:p-12">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <Heart className="text-amber-950 mr-3" size={32} />
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">Users List</h2>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 flex items-center justify-center mb-6">
            <AlertCircle className="mr-2" size={18} /> {error}
          </p>
        )}

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="relative flex-1 mb-4 sm:mb-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
              placeholder="Search by name or email"
              aria-label="Search users by name or email"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-700 text-white">
                <th className="p-3 text-sm font-semibold">Name</th>
                <th className="p-3 text-sm font-semibold">Email</th>
                <th className="p-3 text-sm font-semibold">Phone Number</th>
                <th className="p-3 text-sm font-semibold">City</th>
                <th className="p-3 text-sm font-semibold w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-700">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-amber-200 ${
                      index % 2 === 1 ? 'bg-amber-50' : 'bg-white'
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3 text-gray-900">{user.name || 'N/A'}</td>
                    <td className="p-3 text-gray-900">{user.email || 'N/A'}</td>
                    <td className="p-3 text-gray-900">{user.phoneNumber || 'N/A'}</td>
                    <td className="p-3 text-gray-900">{user.city || 'N/A'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-red-700 transition-colors"
                        aria-label={`Delete user ${user.name || 'Unknown'}`}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteConfirm(null)}
          onKeyDown={(e) => e.key === 'Escape' && setDeleteConfirm(null)}
          tabIndex={0}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-[550px] border border-amber-400 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-amber-700"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <div className="flex items-center justify-center mb-6">
              <Heart className="text-amber-950 mr-2" size={30} />
              <h3 id="delete-confirm-title" className="text-xl sm:text-2xl font-bold text-amber-950">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-900 mb-6 text-center">
              Are you sure you want to delete this user’s profile? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg text-md font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProfile(deleteConfirm)}
                className="px-6 py-3 bg-amber-700 text-white rounded-lg text-md font-semibold hover:bg-amber-800 transition-colors"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;