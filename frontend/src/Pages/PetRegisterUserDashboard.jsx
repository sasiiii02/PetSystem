import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  AlertCircle,
  Search,
  Dog,
  CalendarCheck
} from 'lucide-react';

const PetRegisterUserDashboard = () => {
  const [adoptionForms, setAdoptionForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, formId: null });
  const [messages, setMessages] = useState([]);
  const [homeVisits, setHomeVisits] = useState([]);
  const navigate = useNavigate();

  // Get token and user data from localStorage
  const token = localStorage.getItem('petOwnerToken');
  const userData = JSON.parse(localStorage.getItem('petOwnerUser') || '{}');
  const userEmail = userData.email;

  // Fetch adoption forms for the user
  const fetchAdoptionForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/adoptionform/my-applications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdoptionForms(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching adoption forms:", err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
      setError("Failed to load your adoption forms");
    } finally {
      setLoading(false);
    }
  };

  // Fetch home visits for the user
  const fetchHomeVisits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/homevisits/my-visits', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHomeVisits(response.data);
    } catch (err) {
      console.error("Error fetching home visits:", err);
    }
  };

  // Fetch messages for the user
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/user/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Handle home visit response
  const handleVisitResponse = async (visitId, response) => {
    try {
      await axios.put(
        `http://localhost:5000/api/homevisits/${visitId}`,
        { userResponse: response },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchHomeVisits();
      setNotification({
        show: true,
        message: `Home visit ${response === 'accepted' ? 'accepted' : 'rejected'} successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error("Error responding to home visit:", err);
      setNotification({
        show: true,
        message: "Failed to respond to home visit",
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (!token || !userEmail) {
      navigate('/login');
      return;
    }
    fetchAdoptionForms();
    fetchMessages();
    fetchHomeVisits();
  }, [token, userEmail, navigate]);

  // Handle form deletion
  const handleDeleteForm = async (formId) => {
    try {
      await axios.delete(`http://localhost:5000/api/adoptionform/delete/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAdoptionForms();
      setShowDeleteConfirm({ show: false, formId: null });
    } catch (err) {
      console.error("Error deleting form:", err);
      setError("Failed to delete the adoption form");
    }
  };

  // Filter adoption forms based on search query
  const filteredForms = adoptionForms.filter(form => 
    form.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#80533b]">My Adoption Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your adoption requests and communications</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <AlertCircle className="inline-block mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by pet name or status..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Adoption Forms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#80533b] mb-4 flex items-center">
            <FileText className="mr-2" size={24} />
            My Adoption Forms
          </h2>
          
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No adoption forms found</div>
          ) : (
            <div className="grid gap-4">
              {filteredForms.map((form) => (
                <div key={form._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Pet Image and Basic Info */}
                    <div className="flex-shrink-0">
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden">
                        {form.petImage ? (
                          <img 
                            src={form.petImage.startsWith('http') ? form.petImage : `http://localhost:5000${form.petImage}`} 
                            alt={form.petName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Dog className="text-gray-400" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-bold text-[#80533b]">{form.petName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block ${
                          form.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {form.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Form Details */}
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Pet Type:</span> {form.petType}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Home Type:</span> {form.homeType}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Employment:</span> {form.employmentStatus}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Has Yard:</span> 
                              <span className={`ml-2 ${form.hasYard ? 'text-green-600' : 'text-red-600'}`}>
                                {form.hasYard ? 'Yes' : 'No'}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Other Pets:</span>
                              <span className={`ml-2 ${form.hasOtherPets ? 'text-green-600' : 'text-red-600'}`}>
                                {form.hasOtherPets ? 'Yes' : 'No'}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full mr-2"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Submitted:</span> {new Date(form.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {form.additionalInfo && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700">
                            <span className="font-semibold">Additional Info:</span>
                            <span className="ml-2">{form.additionalInfo}</span>
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => navigate(`/edit-adoption-form/${form._id}`)}
                          className="px-4 py-2 bg-[#D08860] text-white rounded-lg hover:bg-[#80533b] transition-colors flex items-center space-x-2"
                        >
                          <Edit size={18} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm({ show: true, formId: form._id })}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Home Visits Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#80533b] mb-4 flex items-center">
            <CalendarCheck className="mr-2" size={24} />
            Home Visit Requests
          </h2>
          
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : homeVisits.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No home visit requests</div>
          ) : (
            <div className="grid gap-4">
              {homeVisits.map((visit) => (
                <div key={visit._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Visit Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-[#80533b] mb-2">{visit.petName} Home Visit</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-semibold">Date:</span> {new Date(visit.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Time:</span> {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-semibold">Status:</span> {visit.status}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Your Response:</span> {visit.userResponse}
                          </p>
                        </div>
                      </div>
                      {visit.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">
                            <span className="font-semibold">Notes:</span> {visit.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex flex-col justify-center space-y-3">
                      {visit.userResponse === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVisitResponse(visit._id, 'accepted')}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center space-x-2"
                          >
                            <CheckCircle size={18} />
                            <span>Accept Visit</span>
                          </button>
                          <button
                            onClick={() => handleVisitResponse(visit._id, 'rejected')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2"
                          >
                            <XCircle size={18} />
                            <span>Reject Visit</span>
                          </button>
                        </>
                      )}
                      {visit.userResponse !== 'pending' && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          visit.userResponse === 'accepted' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {visit.userResponse === 'accepted' ? 'Visit Accepted' : 'Visit Rejected'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#80533b] mb-4 flex items-center">
            <MessageSquare className="mr-2" size={24} />
            Messages from Pet Owners
          </h2>
          
          {messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No messages yet</div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#80533b]">{message.senderName}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{message.content}</p>
                  <button
                    onClick={() => navigate(`/reply-message/${message._id}`)}
                    className="mt-2 text-[#D08860] hover:text-[#80533b] transition-colors"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this adoption form? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm({ show: false, formId: null })}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteForm(showDeleteConfirm.formId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetRegisterUserDashboard; 