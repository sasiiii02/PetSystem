import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Heart, X, Trash2, Search, Edit } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const ProfessionalsList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores professional ID for deletion
  const navigate = useNavigate();

  // Fetch all professionals on mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5000/api/professionals/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfessionals(response.data);
        setFilteredProfessionals(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError(err.response?.data?.message || 'Error fetching professionals');
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    let filtered = professionals;

    if (roleFilter !== 'All') {
      filtered = filtered.filter((professional) => 
        professional.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (professional) =>
          professional.pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professional.pemail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [searchQuery, roleFilter, professionals]);

  const handleDeleteProfile = async (professionalId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `http://localhost:5000/api/professionals/delete/${professionalId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === 'Profile deleted successfully') {
        setProfessionals(professionals.filter((professional) => professional._id !== professionalId));
        setFilteredProfessionals(
          filteredProfessionals.filter((professional) => professional._id !== professionalId)
        );
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete profile');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Error deleting profile');
    }
  };

  // Calculate role distribution for the pie chart
  const getRoleDistribution = () => {
    const roleCounts = professionals.reduce((acc, professional) => {
      const role = professional.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(roleCounts);
    const data = Object.values(roleCounts);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#001F3F', '#2E2E2E', '#800020'],
          hoverBackgroundColor: ['#003366', '#4A4A4A', '#A52A2A'],
          borderColor: ['#001F3F', '#2E2E2E', '#800020'],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-amber-950">
          <div className="w-6 h-6 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading professionals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex flex-col items-center justify-center p-6 sm:p-12 mt-12">
      <div className="w-full max-w-[1300px] bg-white shadow-2xl rounded-2xl p-6 sm:p-12 mb-8">
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <Heart className="text-amber-950 mr-3" size={32} />
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">Professionals List</h2>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 flex items-center justify-center mb-6">
            <AlertCircle className="mr-2" size={18} /> {error}
          </p>
        )}

        {/* Search Bar and Role Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="relative flex-1 mb-4 sm:mb-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
              placeholder="Search by name or email"
              aria-label="Search professionals by name or email"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-amber-200 text-gray-900 bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
            aria-label="Filter professionals by role"
          >
            <option value="All">All Roles</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="Groomer">Groomer</option>
            <option value="Pet Trainer">Pet Trainer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-700 text-white">
                <th className="p-3 text-sm font-semibold">Name</th>
                <th className="p-3 text-sm font-semibold">Email</th>
                <th className="p-3 text-sm font-semibold">Phone Number</th>
                <th className="p-3 text-sm font-semibold">PID</th>
                <th className="p-3 text-sm font-semibold">Role</th>
                <th className="p-3 text-sm font-semibold">Qualification</th>
                <th className="p-3 text-sm font-semibold">Experience</th>
                <th className="p-3 text-sm font-semibold">Description</th>
                <th className="p-3 text-sm font-semibold w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-3 text-center text-gray-700">
                    No professionals found
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((professional, index) => (
                  <tr
                    key={professional._id}
                    className={`border-b border-amber-200 ${
                      index % 2 === 1 ? 'bg-amber-50' : 'bg-white'
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3 text-gray-900">{professional.pName}</td>
                    <td className="p-3 text-gray-900">{professional.pemail}</td>
                    <td className="p-3 text-gray-900">{professional.pphoneNumber}</td>
                    <td className="p-3 text-gray-900">{professional.pID}</td>
                    <td className="p-3 text-gray-900">{professional.role}</td>
                    <td className="p-3 text-gray-900">{professional.qualification}</td>
                    <td className="p-3 text-gray-900">{professional.experience}</td>
                    <td className="p-3 text-gray-900">{professional.description}</td>
                    <td className="p-3 flex space-x-2">
                      <button
                        onClick={() => navigate(`/admin/professionals/edit/${professional._id}`)}
                        className="bg-amber-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-amber-700 transition-colors"
                        aria-label={`Update professional ${professional.pName}`}
                      >
                        <Edit size={16} className="mr-1" /> Update
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(professional._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg flex items-center text-sm hover:bg-red-700 transition-colors"
                        aria-label={`Delete professional ${professional.pName}`}
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

      {/* Pie Chart Section */}
      <div className="w-full max-w-[800px] bg-white shadow-2xl rounded-2xl p-6 sm:p-12">
        <div className="flex items-center justify-center mb-6">
          <Heart className="text-amber-950 mr-3" size={32} />
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">Professional Role Distribution</h2>
        </div>
        
        <div className="w-full max-w-[500px] mx-auto">
          <Pie 
            data={getRoleDistribution()} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    font: {
                      size: 12
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
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
              Are you sure you want to delete this professional's profile? This action cannot be undone.
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

export default ProfessionalsList;