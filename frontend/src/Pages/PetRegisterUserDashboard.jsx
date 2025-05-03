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
  Search
} from 'lucide-react';

const PetRegisterUserDashboard = () => {
  const [adoptionForms, setAdoptionForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, formId: null });
  const [messages, setMessages] = useState([]);
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

  useEffect(() => {
    if (!token || !userEmail) {
      navigate('/login');
      return;
    }
    fetchAdoptionForms();
    fetchMessages();
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
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold text-[#80533b]">{form.petName}</h3>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          form.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {form.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Pet Type:</span> {form.petType}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Home Type:</span> {form.homeType}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Employment:</span> {form.employmentStatus}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Has Yard:</span> 
                              <span className={`ml-2 ${form.hasYard ? 'text-green-600' : 'text-red-600'}`}>
                                {form.hasYard ? 'Yes' : 'No'}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
                            <p className="text-gray-700">
                              <span className="font-semibold">Other Pets:</span>
                              <span className={`ml-2 ${form.hasOtherPets ? 'text-green-600' : 'text-red-600'}`}>
                                {form.hasOtherPets ? 'Yes' : 'No'}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-[#D08860] rounded-full"></span>
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
                    </div>

                    <div className="flex flex-col items-end space-y-3 ml-6">
                      <button
                        onClick={() => navigate(`/edit-adoption-form/${form._id}`)}
                        className="p-2.5 text-white bg-[#D08860] hover:bg-[#80533b] rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Edit size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm({ show: true, formId: form._id })}
                        className="p-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </button>
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