import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admins/register', formData);
      console.log('Admin registered:', response.data);
      navigate('/admin/redirect/user_admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering admin');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center p-6 sm:p-12 mt-12"
      style={{
        backgroundImage: `url('./assets/staffRegister.jpg')`
      }}
    >
      <div className="max-w-md w-full mx-4 p-8 bg-white bg-opacity-90 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register Admin</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
            >
              <option value="">Select Role</option>
              <option value="user_admin">User Admin</option>
              <option value="event_manager">Event Manager</option>
              <option value="adoption_manager">Adoption Manager</option>
              <option value="appointment_manager">Appointment Manager</option>
              <option value="store_manager">Store Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#B3704D] text-white px-8 py-3 sm:py-4 rounded-xl text-md sm:text-lg font-semibold hover:bg-[#4E2D21] transition-colors"
          >
            Register Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;