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
  CheckCircle
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
      const response = await axios.get('http://localhost:5000/api/adoptionform/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdoptionForms(response.data);
    } catch (err) {
      console.error("Error fetching adoption forms:", err);
      setError("Failed to load adoption forms");
    }
  };

  useEffect(() => {
    fetchPets();
    fetchAdoptionForms();
  }, []);

  // For now, we'll keep using the initial visits data
  useEffect(() => {
    const initialVisits = [
      {
        id: 1,
        petName: 'Buddy',
        adopterName: 'John Doe',
        date: '2024-04-15',
        time: '14:00',
        status: 'Scheduled'
      },
      {
        id: 2,
        petName: 'Whiskers',
        adopterName: 'Jane Smith',
        date: '2024-04-20',
        time: '10:30',
        status: 'Completed'
      }
    ];
    
    setHomeVisits(initialVisits);
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

  // Add navigation handler for scheduling visits
  const handleScheduleVisit = () => {
    navigate('/schedule-visit');
  };

  // Handle navigate to adoptable pets list
  const handleViewAdoptableList = () => {
    navigate('/adoptable-pets');
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
      setShowDeleteConfirm({ show: false, petId: null, petName: '' });
    } catch (err) {
      console.error("Error deleting pet:", err);
      setNotification({
        show: true,
        message: 'Failed to remove pet ❌',
        type: 'error'
      });
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
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2500);
    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        message: 'Failed to add pet ❌',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2500);
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
            className="flex items-center bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={() => setShowAddPetModal(true)}
          >
            <PlusCircle className="mr-2" /> Add Pet
          </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {form.firstName} {form.lastName}
                    </h3>
                    <p className="text-gray-600">Email: {form.email}</p>
                    <p className="text-gray-600">Phone: {form.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pet Type: {form.petType}</p>
                    <p className="text-gray-600">Preferred Pet: {form.petName}</p>
                    <p className="text-gray-600">Home Type: {form.homeType}</p>
                    <p className="text-gray-600">Employment: {form.employmentStatus}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Has Yard:</span> {form.hasYard ? 'Yes' : 'No'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Has Other Pets:</span> {form.hasOtherPets ? 'Yes' : 'No'}
                  </p>
                  {form.additionalInfo && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-semibold">Additional Info:</span> {form.additionalInfo}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={() => handleApproveApplication(form._id)}
                  >
                    <CheckCircle className="inline-block mr-2" size={18} />
                    Approve
                  </button>
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleRejectApplication(form._id)}
                  >
                    <XCircle className="inline-block mr-2" size={18} />
                    Reject
                  </button>
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
        <button 
          className="flex items-center bg-gradient-to-r from-gray-500 to-gray-700 text-white px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
          onClick={handleScheduleVisit}
        >
          <PlusCircle className="mr-2" /> Schedule Visit
        </button>
      </div>
      <div className="space-y-4">
        {homeVisits.map(visit => (
          <div 
            key={visit.id} 
            className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Home className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{visit.petName} Adoption</h3>
                <p className="text-gray-600">
                  Adopter: {visit.adopterName} | {visit.date} at {visit.time}
                </p>
              </div>
            </div>
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold 
              ${visit.status === 'Scheduled' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'}
            `}>
              {visit.status}
            </span>
          </div>
        ))}
      </div>
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
    } catch (error) {
      console.error('Error approving application:', error);
      setNotification({
        show: true,
        message: 'Failed to approve application',
        type: 'error'
      });
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
    } catch (error) {
      console.error('Error rejecting application:', error);
      setNotification({
        show: true,
        message: 'Failed to reject application',
        type: 'error'
      });
    }
  };

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
        {activeSection === 'reports' && renderReports()}
      </div>

      {/* Add Pet Modal */}
      {renderAddPetModal()}
      
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