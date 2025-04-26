import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiTrash2, FiMail } from 'react-icons/fi';

const AttendeeList = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendees from backend
  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/registrations/event/${eventId}`);
      setAttendees(response.data.registrations || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load attendees");
      console.error("Error fetching attendees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const filteredAttendees = attendees.filter(attendee => 
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAttendee = async (registrationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/registrations/${registrationId}`);
      fetchAttendees(); // Refresh the list after deletion
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete attendee");
      console.error("Error deleting attendee:", err);
    }
  };

  const handleSendEmail = (email) => {
    // Implement email functionality or open mail client
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-amber-950">Registered Attendees</h3>
          <p className="text-gray-600">{attendees.length} total registrations</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08860] focus:border-transparent transition-all w-full"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={fetchAttendees}
            disabled={loading}
            className="p-2 text-amber-700 hover:text-amber-800 disabled:opacity-50"
            title="Refresh attendees"
          >
            <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
          <p className="mt-2 text-gray-600">Loading attendees...</p>
        </div>
      ) : filteredAttendees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((attendee) => (
            <div 
              key={attendee._id} 
              className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#D08860] hover:shadow-md transition-all duration-300 relative"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#D08860] text-white rounded-full flex items-center justify-center font-bold">
                  {attendee.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-amber-950">{attendee.name}</p>
                  <p className="text-sm text-gray-600">{attendee.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(attendee.registeredAt).toLocaleDateString()} • {attendee.tickets} ticket{attendee.tickets !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                <button
                  onClick={() => handleSendEmail(attendee.email)}
                  className="text-gray-500 hover:text-amber-700 p-1"
                  title="Send email"
                >
                  <FiMail className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteAttendee(attendee._id)}
                  className="text-gray-500 hover:text-red-600 p-1"
                  title="Remove attendee"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.231-1.47-.62-2.062M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.231-1.47.62-2.062M14 14h2.62M5.625 14h2.62m0 0a2.96 2.96 0 00.62 2.062M5.625 14H4a1 1 0 00-.707.293l-2 2a1 1 0 000 1.414l2 2a1 1 0 00.707.293h15a1 1 0 00.707-.293l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-.707-.293H14zm0 0V10a2 2 0 10-4 0v4m0 0a2 2 0 104 0z" />
          </svg>
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No matching attendees found' : 'No users registered yet'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-amber-700 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendeeList;