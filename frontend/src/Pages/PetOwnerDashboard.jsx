import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, 
  Edit, 
  Trash2, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Syringe,
  Scissors
} from 'lucide-react';

const PetOwnerDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, petId: null });
  const navigate = useNavigate();

  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail');

  // Fetch pet owner's adoption forms
  const fetchPets = async () => {
    try {
      setLoading(true);
      // Get all pets and filter by user's email
      const response = await axios.get('http://localhost:5000/api/foradoption');
      const userPets = response.data.filter(pet => pet.email === userEmail);
      setPets(userPets);
      setError(null);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load your pet listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userEmail) {
      // If no user email is found, redirect to login
      navigate('/login');
      return;
    }
    fetchPets();
  }, [userEmail, navigate]);

  // Handle delete confirmation
  const handleDeleteClick = (petId) => {
    setShowDeleteConfirm({ show: true, petId });
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/foradoption/${showDeleteConfirm.petId}`);
      setShowDeleteConfirm({ show: false, petId: null });
      fetchPets(); // Refresh the list
    } catch (err) {
      console.error("Error deleting pet:", err);
      setError("Failed to delete pet listing");
    }
  };

  // Navigate to edit form
  const handleEditClick = (petId) => {
    navigate(`/edit-pet/${petId}`);
  };

  // Navigate to add new pet form
  const handleAddNewPet = () => {
    navigate('/add_adoptable_pet');
  };

  // Function to get the appropriate pet icon based on species
  const getPetIcon = (species) => {
    switch (species.toLowerCase()) {
      case 'dog':
        return <Dog className="w-5 h-5" />;
      case 'cat':
        return <Cat className="w-5 h-5" />;
      case 'bird':
        return <Bird className="w-5 h-5" />;
      case 'rabbit':
        return <Rabbit className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B3704D] mx-auto"></div>
          <p className="mt-4 text-[#80533b]">Loading your pet listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#80533b]">My Pet Listings</h1>
            <p className="text-gray-600 mt-2">Manage your pets listed for adoption</p>
          </div>
          <button
            onClick={handleAddNewPet}
            className="bg-[#B3704D] text-white px-6 py-3 rounded-xl hover:bg-[#D08860] transition-colors flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add New Pet
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <AlertCircle className="inline-block mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Pet Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Pet Image with Species Icon */}
              <div className="h-48 relative">
                <img
                  src={pet.petImage ? `http://localhost:5000${pet.petImage}` : '/placeholder-pet.jpg'}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-2">
                  {getPetIcon(pet.petSpecies)}
                </div>
              </div>

              {/* Pet Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#80533b]">{pet.petName}</h3>
                    <p className="text-gray-600">{pet.petBreed}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(pet._id)}
                      className="p-2 text-[#B3704D] hover:bg-[#B3704D]/10 rounded-lg transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pet._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#B3704D]" />
                    <p><span className="font-medium">Age:</span> {pet.petAge}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#B3704D]" />
                    <p><span className="font-medium">Gender:</span> {pet.petGender}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#B3704D]" />
                    <p><span className="font-medium">Status:</span> {pet.status || 'Available'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-[#B3704D]" />
                    <p><span className="font-medium">Vaccinated:</span> {pet.vaccinated ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-[#B3704D]" />
                    <p><span className="font-medium">Neutered:</span> {pet.neutered ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Owner Contact Information */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Owner Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#B3704D]" />
                      <p className="text-sm">{pet.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#B3704D]" />
                      <p className="text-sm">{pet.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pets.length === 0 && !error && (
          <div className="text-center py-12">
            <Heart className="mx-auto text-[#B3704D]" size={48} />
            <h3 className="text-xl font-semibold text-[#80533b] mt-4">No Pets Listed Yet</h3>
            <p className="text-gray-600 mt-2">Start by adding your first pet for adoption</p>
            <button
              onClick={handleAddNewPet}
              className="mt-4 bg-[#B3704D] text-white px-6 py-3 rounded-xl hover:bg-[#D08860] transition-colors"
            >
              Add Your First Pet
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-[#80533b] mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this pet from the adoption listing? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm({ show: false, petId: null })}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

export default PetOwnerDashboard; 