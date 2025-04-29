import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react'; // Added Calendar icon for the header

// Fallback API URL if environment variables are not available
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AppointmentGroomerTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch groomer appointments and sort by date (newest to oldest)
  useEffect(() => {
    const fetchGroomerAppointments = async () => {
      try {
        const url = `${API_URL}/api/appointments/groomer-appointments`;
        console.log('Fetching from URL:', url); // Debug log

        const response = await fetch(url);
        const text = await response.text();
        console.log('Raw response:', text);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}. Response: ${text}`);
        }

        const data = JSON.parse(text);
        console.log('Parsed data:', data);

        // Sort appointments by appointmentDate (newest to oldest)
        const sortedData = data.sort((a, b) => 
          new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );

        setAppointments(sortedData);
        setFilteredAppointments(sortedData); // Initialize filtered appointments
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroomerAppointments();
  }, []);

  // Handle search by user name
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) =>
        appointment.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  // Button handlers
  const handleNotify = (appointment) => {
    console.log('Notify clicked for:', appointment);
    alert(`Notifying ${appointment.userName} at ${appointment.phoneNo}`);
  };

  const handleManage = (appointment) => {
    console.log('Manage clicked for:', appointment);
    alert(`Managing appointment for ${appointment.email}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 bg-red-50 rounded-lg">
        <p className="font-semibold">Error loading data</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
        <Calendar className="mr-2 text-amber-600" size={24} />
        Pet Groomer Appointments
      </h2>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-amber-950 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">User Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Appointment Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Groomer ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <tr
                    key={appointment._id || index}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm">{appointment.userName}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(appointment.appointmentDate)}</td>
                    <td className="px-6 py-4 text-sm">{appointment.appointmentTime || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{appointment.doctorId}</td>
                    <td className="px-6 py-4 text-sm">${appointment.appointmentFee?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-sm">{appointment.phoneNo}</td>
                    <td className="px-6 py-4 text-sm">{appointment.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleNotify(appointment)}
                          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          Notify
                        </button>
                        <button
                          onClick={() => handleManage(appointment)}
                          className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentGroomerTable;