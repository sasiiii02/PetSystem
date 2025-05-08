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
    <div className="min-h-screen bg-[url('./assets/staffRegister.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] opacity-90 transform transition-transform duration-600 p-6 sm:p-12 mt-12 rounded-lg shadow-xl w-4/5 max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-[#4E2D21] mb-6">Register Admin</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#4E2D21] font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656] bg-white bg-opacity-90"
            />
          </div>
          <div>
            <label className="block text-[#4E2D21] font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656] bg-white bg-opacity-90"
            />
          </div>
          <div>
            <label className="block text-[#4E2D21] font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656] bg-white bg-opacity-90"
            />
          </div>
          <div>
            <label className="block text-[#4E2D21] font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a7656] bg-white bg-opacity-90"
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
            className="w-full bg-[#D88C6D] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#4E2D21] transition-colors transform hover:scale-105 transition-transform"
          >
            Register Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;