import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  PawPrint, 
  CalendarCheck, 
  FileText, 
  Dog, 
  Cat, 
  Home, 
  User, 
  PlusCircle,
  HeartHandshake,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  CheckCircle,
  Search,
  MapPin
} from 'lucide-react';

const PetAdoptionCoordinatorDashboard = () => {
  const [pets, setPets] = useState([]);
  const [homeVisits, setHomeVisits] = useState([]);
  const [activeSection, setActiveSection] = useState('pets');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [adoptionForms, setAdoptionForms] = useState([]);
  const [newPet, setNewPet] = useState({
    petName: '',
    petSpecies: 'Dog',
    petBreed: '',
    petAge: '',
    petGender: 'Male',
    vaccinated: false,
    neutered: false,
    specialNeeds: false,
    status: 'Available'
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, petId: null, petName: '' });
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [lostPets, setLostPets] = useState([]);
  const [foundPets, setFoundPets] = useState([]);
  const [lostFoundSection, setLostFoundSection] = useState('lost'); // 'lost' or 'found'
  const navigate = useNavigate();

  // Fetch pets data from MongoDB
  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/foradoption');
      
      // Map the data to include a status field if it doesn't exist
      const petsWithStatus = response.data.map(pet => ({
        ...pet,
        status: pet.status || "Available" // Default to "Available" if no status exists
      }));
      
      setPets(petsWithStatus);
      setError(null);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch adoption forms
  const fetchAdoptionForms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage");
        setError("Authentication required. Please log in again.");
        return;
      }

      console.log("Attempting to fetch adoption forms with token:", token);
      const response = await axios.get('http://localhost:5000/api/adoptionform/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Adoption forms response:", response.data);
      setAdoptionForms(response.data);
    } catch (err) {
      console.error("Error fetching adoption forms:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        setError(`Failed to load adoption forms: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError("No response received from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError(`Failed to load adoption forms: ${err.message}`);
      }
    }
  };

  // Add this function to fetch home visits
  const fetchHomeVisits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/homevisits', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHomeVisits(response.data);
    } catch (error) {
      console.error('Error fetching home visits:', error);
      setError('Failed to load home visits');
    }
  };

  // Update the fetch functions
  const fetchLostPets = async () => {
    try {
      console.log('Fetching lost pets...');
      const response = await axios.get('http://localhost:5000/api/lost-and-found/lost');
      console.log('Lost pets response:', response.data);
      setLostPets(response.data);
    } catch (error) {
      console.error('Error fetching lost pets:', error);
      setError('Failed to load lost pets');
    }
  };

  const fetchFoundPets = async () => {
    try {
      console.log('Fetching found pets...');
      const response = await axios.get('http://localhost:5000/api/lost-and-found/found');
      console.log('Found pets response:', response.data);
      setFoundPets(response.data);
    } catch (error) {
      console.error('Error fetching found pets:', error);
      setError('Failed to load found pets');
    }
  };

  useEffect(() => {
    fetchPets();
    fetchAdoptionForms();
    fetchHomeVisits();
    fetchLostPets();
    fetchFoundPets();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPet({
      ...newPet,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission to add a new pet
  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all pet data to formData
      Object.keys(newPet).forEach(key => {
        formData.append(key, newPet[key]);
      });
      
      // If there's a file input for pet image
      const fileInput = document.getElementById('petImage');
      if (fileInput && fileInput.files[0]) {
        formData.append('petImage', fileInput.files[0]);
      }
      
      await axios.post('http://localhost:5000/api/foradoption', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset the form and close modal
      setNewPet({
        petName: '',
        petSpecies: 'Dog',
        petBreed: '',
        petAge: '',
        petGender: 'Male',
        vaccinated: false,
        neutered: false,
        specialNeeds: false,
        status: 'Available'
      });
      setShowAddPetModal(false);
      
      // Refresh pet list
      fetchPets();
      
    } catch (err) {
      console.error("Error adding pet:", err);
      alert("Failed to add pet. Please try again.");
    }
  };

  // Handle navigate to adoptable pets list
  const handleViewAdoptableList = () => {
    navigate('/info_adoptable_pet');
  };

  // Handle delete pet
  const handleDeletePet = async (petId) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`http://localhost:5000/api/adoptablepets/${petId}`);
      fetchPets();
      setNotification({
        show: true,
        message: 'Pet removed successfully! 🗑️',
        type: 'success'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      setShowDeleteConfirm({ show: false, petId: null, petName: '' });
    } catch (err) {
      console.error("Error deleting pet:", err);
      setNotification({
        show: true,
        message: 'Failed to remove pet ❌',
        type: 'error'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopyPet = async (petId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/movePet/${petId}`);
      setNotification({
        show: true,
        message: 'Pet added successfully! 🐾',
        type: 'success'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        message: 'Failed to add pet ❌',
        type: 'error'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  // Add Pet Modal
  const renderAddPetModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showAddPetModal ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={() => setShowAddPetModal(false)}></div>
      <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Pet</h2>
        <form onSubmit={handleAddPet}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Pet Name</label>
              <input 
                type="text" 
                name="petName" 
                value={newPet.petName} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Species</label>
              <select 
                name="petSpecies" 
                value={newPet.petSpecies} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Breed</label>
              <input 
                type="text" 
                name="petBreed" 
                value={newPet.petBreed} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Age (years)</label>
              <input 
                type="number" 
                name="petAge" 
                value={newPet.petAge} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Gender</label>
              <select 
                name="petGender" 
                value={newPet.petGender} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Pet Image</label>
              <input 
                type="file" 
                id="petImage"
                name="petImage" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="vaccinated" 
                  checked={newPet.vaccinated} 
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Vaccinated</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="neutered" 
                  checked={newPet.neutered} 
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Neutered</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="specialNeeds" 
                  checked={newPet.specialNeeds} 
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Special Needs</span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setShowAddPetModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-white bg-gradient-to-r from-gray-500 to-gray-700 rounded-md hover:opacity-90"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPetList = () => (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Dog className="mr-3 text-gray-600" /> Adoptable Pets
          </h2>
          <div className="ml-4 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white font-semibold">
              Total Pets: {pets.length}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          
          <button 
            className="flex items-center bg-gradient-to-r from-gray-600 to-gray-800 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={handleViewAdoptableList}
          >
            <Dog className="mr-2" /> View Public List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading pets...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length === 0 ? (
            <div className="col-span-3 text-center py-10">No pets available for adoption</div>
          ) : (
            pets.map((pet) => (
              <div 
                key={pet._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
              >
                {/* Pet Image */}
                {pet.petImage ? (
                  <img 
                    src={`http://localhost:5000${pet.petImage}`} 
                    alt={pet.petName} 
                    className="w-full h-110 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                
                <div className="p-4">
                  {/* Pet Name & Status */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{pet.petName}</h3>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-semibold 
                      ${pet.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {pet.status}
                    </span>
                  </div>

                  {/* Pet Information */}
                  <div className="text-gray-600">
                    <p>Species: {pet.petSpecies}</p>
                    <p>Breed: {pet.petBreed}</p>
                    <p>Age: {pet.petAge} years</p>
                    <p>Gender: {pet.petGender}</p>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${pet.vaccinated ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>Vaccinated: {pet.vaccinated ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${pet.neutered ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>Neutered: {pet.neutered ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${pet.specialNeeds ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                      <span>Special Needs: {pet.specialNeeds ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                      onClick={() => handleCopyPet(pet._id)}
                    >
                      <PlusCircle className="mr-2" size={18} />
                      Add Pet
                    </button>

                    <button 
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                      onClick={() => setShowDeleteConfirm({ 
                        show: true, 
                        petId: pet._id, 
                        petName: pet.petName 
                      })}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="mr-2" size={18} />
                      Remove Pet
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderAdoptionForms = () => (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <FileText className="mr-3 text-gray-600" /> Adoption Applications
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading applications...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {adoptionForms.length === 0 ? (
            <div className="text-center py-10">No adoption applications received</div>
          ) : (
            adoptionForms.map((form) => (
              <div 
                key={form._id} 
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
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
                      <h3 className="text-xl font-bold text-gray-800">{form.petName}</h3>
                      <p className="text-gray-600">Pet Type: {form.petType}</p>
                    </div>
                  </div>

                  {/* Right Section - Form Details */}
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {form.firstName} {form.lastName}
                        </h3>
                        <p className="text-gray-600">Email: {form.email}</p>
                        <p className="text-gray-600">Phone: {form.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Home Type: {form.homeType}</p>
                        <p className="text-gray-600">Employment: {form.employmentStatus}</p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Has Yard:</span> {form.hasYard ? 'Yes' : 'No'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Has Other Pets:</span> {form.hasOtherPets ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    {form.additionalInfo && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                          <span className="font-semibold">Additional Info:</span> {form.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-3">
                      {form.status === 'pending' && (
                        <>
                          <button 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
                            onClick={() => handleApproveApplication(form._id)}
                          >
                            <CheckCircle className="inline-block" size={18} />
                            <span>Approve</span>
                          </button>
                          <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                            onClick={() => handleScheduleVisit(form)}
                          >
                            <CalendarCheck className="inline-block" size={18} />
                            <span>Schedule Visit</span>
                          </button>
                          <button 
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                            onClick={() => handleRejectApplication(form._id)}
                          >
                            <XCircle className="inline-block" size={18} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {form.status === 'approved' && (
                        <div className="flex space-x-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                            Approved
                          </span>
                          <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                            onClick={() => handleScheduleVisit(form)}
                          >
                            <CalendarCheck className="inline-block" size={18} />
                            <span>Schedule Visit</span>
                          </button>
                        </div>
                      )}
                      {form.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderHomeVisits = () => (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <CalendarCheck className="mr-3 text-gray-600" /> Home Visits
        </h2>
       
      </div>
      <div className="space-y-4">
        {homeVisits.map(visit => (
          <div 
            key={visit._id} 
            className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Home className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{visit.petName} Adoption</h3>
                <p className="text-gray-600">
                  Adopter: {visit.adopterName} | {visit.date ? new Date(visit.date).toLocaleDateString() : 'Date not set'}
                </p>
                <p className="text-gray-600">
                  Email: {visit.adopterEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold 
                ${visit.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                  : visit.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'}
            `}>
                {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
            </span>
              {visit.status === 'pending' && (
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleUpdateVisitStatus(visit._id, 'completed')}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLostFoundPets = () => (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <MapPin className="mr-3 text-gray-600" /> Lost & Found Pets
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setLostFoundSection('lost')}
            className={`px-4 py-2 rounded-lg transition-all ${
              lostFoundSection === 'lost'
                ? 'bg-[#D08860] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lost Pets ({lostPets.length})
          </button>
          <button
            onClick={() => setLostFoundSection('found')}
            className={`px-4 py-2 rounded-lg transition-all ${
              lostFoundSection === 'found'
                ? 'bg-[#D08860] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Found Pets ({foundPets.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D08860]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(lostFoundSection === 'lost' ? lostPets : foundPets).length === 0 ? (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No {lostFoundSection} pets available
            </div>
          ) : (
            (lostFoundSection === 'lost' ? lostPets : foundPets).map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105"
              >
                <div className="relative pt-[125%]">
                  {pet.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${pet.image}`}
                      alt={pet.petName}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#80533b] mb-2">{pet.petName}</h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Type:</span> {pet.petType}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Breed:</span> {pet.breed}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">
                      {lostFoundSection === 'lost' ? 'Last Seen Location:' : 'Found Location:'}
                    </span>{' '}
                    {lostFoundSection === 'lost' ? pet.lastSeenLocation : pet.foundLocation}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">
                      {lostFoundSection === 'lost' ? 'Last Seen Date:' : 'Found Date:'}
                    </span>{' '}
                    {new Date(lostFoundSection === 'lost' ? pet.lastSeenDate : pet.foundDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteLostFoundPet(pet._id, lostFoundSection)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
        <FileText className="mr-3 text-gray-600" /> Adoption Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 transform transition-all hover:scale-105">
          <div className="flex justify-between items-center">
            <HeartHandshake className="text-gray-500" size={40} />
            <span className="text-3xl font-bold text-gray-700">
              {pets.length}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Total Pets</h3>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div 
              className="h-2 bg-gray-500 rounded-full" 
              style={{
                width: `${(pets.length / Math.max(10, pets.length)) * 100}%`
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 transform transition-all hover:scale-105">
          <div className="flex justify-between items-center">
            <CheckCircle2 className="text-green-500" size={40} />
            <span className="text-3xl font-bold text-green-700">
              {pets.filter(p => p.status === 'Available').length}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Available Pets</h3>
          <div className="h-2 w-full bg-green-100 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full" 
              style={{
                width: pets.length > 0 
                  ? `${(pets.filter(p => p.status === 'Available').length / pets.length) * 100}%`
                  : '0%'
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 transform transition-all hover:scale-105">
          <div className="flex justify-between items-center">
            <Clock className="text-blue-500" size={40} />
            <span className="text-3xl font-bold text-blue-700">
              {homeVisits.filter(v => v.status === 'Scheduled').length}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Scheduled Visits</h3>
          <div className="h-2 w-full bg-blue-100 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full" 
              style={{
                width: homeVisits.length > 0
                  ? `${(homeVisits.filter(v => v.status === 'Scheduled').length / homeVisits.length) * 100}%`
                  : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const Notification = ({ message, type }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`
        animate-fade-in
        px-8 py-4 rounded-xl shadow-2xl 
        flex items-center gap-3
        backdrop-blur-sm
        ${type === 'success' 
          ? 'bg-green-500/90 text-white ring-2 ring-green-400' 
          : 'bg-red-500/90 text-white ring-2 ring-red-400'}
        transform transition-all duration-300 ease-out
        min-w-[300px] justify-center
      `}>
        {type === 'success' ? (
          <CheckCircle className="h-6 w-6 flex-shrink-0" />
        ) : (
          <XCircle className="h-6 w-6 flex-shrink-0" />
        )}
        <span className="font-semibold text-lg text-center">{message}</span>
      </div>
    </div>
  );

  // Add this new component for the delete confirmation modal
  const DeleteConfirmationModal = ({ petName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 z-50 transform transition-all">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Removal</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove <span className="font-semibold text-gray-800">{petName}</span> from the adoptable list?
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Remove Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleApproveApplication = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/adoptionform/update/${formId}`,
        { status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchAdoptionForms();
      setNotification({
        show: true,
        message: 'Application approved successfully',
        type: 'success'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error approving application:', error);
      setNotification({
        show: true,
        message: 'Failed to approve application',
        type: 'error'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const handleRejectApplication = async (formId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/adoptionform/update/${formId}`,
        { status: 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchAdoptionForms();
      setNotification({
        show: true,
        message: 'Application rejected successfully',
        type: 'success'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error rejecting application:', error);
      setNotification({
        show: true,
        message: 'Failed to reject application',
        type: 'error'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const handleScheduleVisit = async (form) => {
    setSelectedForm(form);
    setShowAddVisitModal(true);
  };

  const handleSubmitVisit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const visitData = {
        adoptionFormId: selectedForm._id,
        adopterName: `${selectedForm.firstName} ${selectedForm.lastName}`,
        adopterEmail: selectedForm.email,
        petName: selectedForm.petName,
        date: new Date(`${visitDate}T${visitTime}`),
        notes: visitNotes,
        status: 'pending'
      };

      await axios.post(
        'http://localhost:5000/api/homevisits',
        visitData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Reset form and close modal
      setVisitDate('');
      setVisitTime('');
      setVisitNotes('');
      setShowAddVisitModal(false);
      setSelectedForm(null);

      // Refresh visits list
      fetchHomeVisits();
      
      setNotification({
        show: true,
        message: 'Home visit scheduled successfully',
        type: 'success'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error scheduling visit:', error);
      setNotification({
        show: true,
        message: 'Failed to schedule home visit',
        type: 'error'
      });
      // Auto-close notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const renderVisitSchedulingModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showAddVisitModal ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={() => setShowAddVisitModal(false)}></div>
      <div className="bg-white rounded-xl shadow-2xl p-6 z-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Home Visit</h2>
        <form onSubmit={handleSubmitVisit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Adopter Name</label>
              <input 
                type="text" 
                value={`${selectedForm?.firstName} ${selectedForm?.lastName}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Pet Name</label>
              <input 
                type="text" 
                value={selectedForm?.petName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Visit Date</label>
              <input 
                type="date" 
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Visit Time</label>
              <input 
                type="time" 
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Notes</label>
              <textarea 
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Any special instructions or notes for the visit..."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setShowAddVisitModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-white bg-gradient-to-r from-gray-500 to-gray-700 rounded-md hover:opacity-90"
            >
              Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Add this CSS animation at the top of your file after the imports
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fade-in {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);

  // Update the delete handler
  const handleDeleteLostFoundPet = async (petId, type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          show: true,
          message: 'Authentication required. Please log in again.',
          type: 'error'
        });
        return;
      }

      if (!window.confirm(`Are you sure you want to delete this ${type} pet report?`)) {
        return;
      }

      console.log(`Deleting ${type} pet with ID:`, petId);
      await axios.delete(`http://localhost:5000/api/lost-and-found/${type}/${petId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (type === 'lost') {
        setLostPets(lostPets.filter(pet => pet._id !== petId));
      } else {
        setFoundPets(foundPets.filter(pet => pet._id !== petId));
      }
      
      setNotification({
        show: true,
        message: `${type === 'lost' ? 'Lost' : 'Found'} pet removed successfully! 🗑️`,
        type: 'success'
      });
    } catch (error) {
      console.error(`Error deleting ${type} pet:`, error);
      setNotification({
        show: true,
        message: error.response?.data?.message || `Failed to remove ${type} pet ❌`,
        type: 'error'
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-gray-700 to-gray-900 shadow-2xl">
        <div className="p-6 border-b border-white/20 flex items-center">
          <PawPrint className="mr-3 text-white" size={40} />
          <h1 className="text-2xl font-bold text-white">Pawsome Adoptions</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { 
                name: 'Pets', 
                icon: Dog, 
                section: 'pets',
                color: 'hover:bg-gray-600' 
              },
              { 
                name: 'Adoption Forms', 
                icon: FileText, 
                section: 'forms',
                color: 'hover:bg-gray-600' 
              },
              { 
                name: 'Home Visits', 
                icon: CalendarCheck, 
                section: 'visits',
                color: 'hover:bg-gray-600' 
              },
              { 
                name: 'Lost & Found', 
                icon: MapPin, 
                section: 'lostfound',
                color: 'hover:bg-gray-600' 
              },
              { 
                name: 'Reports', 
                icon: FileText, 
                section: 'reports',
                color: 'hover:bg-gray-600' 
              }
            ].map(item => (
              <li 
                key={item.section}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer 
                  ${activeSection === item.section 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 ' + item.color}
                  transition-all duration-300
                `}
                onClick={() => setActiveSection(item.section)}
              >
                <item.icon className="mr-3" />
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'pets' && renderPetList()}
        {activeSection === 'forms' && renderAdoptionForms()}
        {activeSection === 'visits' && renderHomeVisits()}
        {activeSection === 'lostfound' && renderLostFoundPets()}
        {activeSection === 'reports' && renderReports()}
      </div>

      {/* Add Pet Modal */}
      {renderAddPetModal()}
      
      {/* Visit Scheduling Modal */}
      {renderVisitSchedulingModal()}
      
      {/* Notification */}
      {notification.show && (
        <Notification message={notification.message} type={notification.type} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <DeleteConfirmationModal
          petName={showDeleteConfirm.petName}
          onConfirm={() => handleDeletePet(showDeleteConfirm.petId)}
          onCancel={() => setShowDeleteConfirm({ show: false, petId: null, petName: '' })}
        />
      )}
    </div>
  );
};

export default PetAdoptionCoordinatorDashboard;