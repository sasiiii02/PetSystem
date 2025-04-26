import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Heart, X, Trash2 } from 'lucide-react';

const ProfessionalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    professionalEmail: '',
    phoneNumber: '',
    city: '',
    role: 'event_manager',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch professional data on mount
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get(`http://localhost:5000/api/professionals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          professionalEmail: response.data.professionalEmail,
          phoneNumber: response.data.phoneNumber,
          city: response.data.city,
          role: response.data.role,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professional:', err);
        setError(err.response?.data?.message || 'Error fetching professional');
        setLoading(false);
      }
    };
    fetchProfessional();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/professionals/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.professional) {
        navigate('/admin/professionals');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Error updating professional');
    }
  };

  // Handle delete professional
  const handleDeleteProfessional = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/professionals/delete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === 'Profile deleted successfully') {
        navigate('/admin/professionals');
      } else {
        setError('Failed to delete professional');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Error deleting professional');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-amber-950">
          <div className="w-6 h-6 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading professional...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-[800px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
          <div className="absolute inset-0 bg-[url('./assets/staffRegister.jpg')] bg-cover bg-center flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Edit Professional Profile</h2>
              <p className="text-lg sm:text-xl">Update professional details</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-12">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <Heart className="text-amber-950 mr-3" size={32} />
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">Edit Professional</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm sm:text-md font-medium text-amber-950 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  error.includes('name') ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="Professional Name"
                aria-label="Professional Name"
              />
            </div>
            <div>
              <label htmlFor="professionalEmail" className="block text-sm sm:text-md font-medium text-amber-950 mb-2">
                Email
              </label>
              <input
                type="email"
                id="professionalEmail"
                name="professionalEmail"
                value={formData.professionalEmail}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  error.includes('email') ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="professional@email.com"
                aria-label="Professional Email"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm sm:text-md font-medium text-amber-950 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="\d{10}"
                title="Phone number must be a 10-digit number"
                className={`w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  error.includes('phoneNumber') ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="1234567890"
                aria-label="Phone Number"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm sm:text-md font-medium text-amber-950 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  error.includes('city') ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="City"
                aria-label="City"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm sm:text-md font-medium text-amber-950 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 ${
                  error.includes('role') ? 'border-red-500' : 'border-amber-200'
                }`}
                aria-label="Professional Role"
              >
                <option value="event_manager">Event Manager</option>
                <option value="store_manager">Store Manager</option>
                <option value="user_admin">User Admin</option>
              </select>
            </div>

            {error && !error.includes('name') && !error.includes('email') && !error.includes('phoneNumber') && !error.includes('city') && !error.includes('role') && (
              <p className="text-center text-sm text-red-500 flex items-center justify-center">
                <AlertCircle className="mr-2" size={18} /> {error}
              </p>
            )}

            <div className="flex flex-col space-y-4 pt-4">
              <button
                type="submit"
                className="w-full bg-amber-700 text-white px-8 py-3 sm:py-4 rounded-lg text-md sm:text-lg font-semibold hover:bg-amber-800 transition-colors"
                aria-label="Update professional profile"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white px-8 py-3 sm:py-4 rounded-lg text-md sm:text-lg font-semibold hover:bg-red-700 transition-colors"
                aria-label="Delete professional profile"
              >
                Delete Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowDeleteConfirm(false)}
          tabIndex={0}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-[550px] border border-amber-100 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="delete-confirm-title"
          >
            <button
              onClick={() => setShowDeleteConfirm(false)}
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
              Are you sure you want to delete this professional’s profile? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg text-md font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfessional}
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

export default ProfessionalEdit;