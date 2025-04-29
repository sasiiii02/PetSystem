import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfessionalAppointmentsTable() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('profToken');

  useEffect(() => {
    if (!token) {
      navigate('/professional/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/professional-appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(data);
        setFilteredAppointments(data); // Initialize filtered list
        setLoading(false);
      } catch (error) {
        console.error('Error fetching professional appointments:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('profToken');
          localStorage.removeItem('profRole');
          navigate('/professional/login');
        }
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, navigate]);

  // Handle search input and filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAppointments(appointments);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = appointments
      .filter((appt) =>
        appt.userName.toLowerCase().includes(lowerSearchTerm)
      )
      .sort((a, b) => {
        const aName = a.userName.toLowerCase();
        const bName = b.userName.toLowerCase();

        // Exact match
        if (aName === lowerSearchTerm && bName !== lowerSearchTerm) return -1;
        if (bName === lowerSearchTerm && aName !== lowerSearchTerm) return 1;

        // Starts with
        if (aName.startsWith(lowerSearchTerm) && !bName.startsWith(lowerSearchTerm)) return -1;
        if (bName.startsWith(lowerSearchTerm) && !aName.startsWith(lowerSearchTerm)) return 1;

        // Contains (default sort by name)
        return aName.localeCompare(bName);
      });

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  const handleAttendAppointment = (appointmentId) => {
    navigate(`/professional/appointment/${appointmentId}/pet-details`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="bg-gray-100 p-6 min-h-screen animate-fade-in"
      style={{
        backgroundImage: `linear-gradient(rgba(252, 242, 233, 0.5), rgba(243, 231, 220, 0.5))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-amber-950">Scheduled Appointments</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 max-w-md mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by pet owner name..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 hover:shadow-md"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-amber-700 text-white">
              <th className="px-6 py-3 text-left">Pet Owner</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt, index) => (
                <tr
                  key={appt._id}
                  className={`border-b hover:bg-gray-100 ${
                    index === 0 && searchTerm ? 'bg-amber-100' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-amber-950">{appt.userName}</td>
                  <td className="px-6 py-4 text-amber-950">{appt.appointmentType}</td>
                  <td className="px-6 py-4 text-amber-950">
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-amber-950">{appt.appointmentTime}</td>
                  <td className="px-6 py-4 text-amber-950">{appt.phoneNo}</td>
                  <td className="px-6 py-4 text-amber-950">{appt.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAttendAppointment(appt._id)}
                      className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors"
                    >
                      Attend Now
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No matching appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}