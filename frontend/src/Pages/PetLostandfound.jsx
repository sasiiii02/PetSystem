'use client'

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MapPin, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PetLostandfound = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lost');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, [activeTab]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'lost' ? '/api/lost-and-found/lost' : '/api/lost-and-found/found';
      const response = await axios.get(`http://localhost:5000${endpoint}`);
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPetClick = () => {
    const token = localStorage.getItem('petOwnerToken');
    if (token) {
      navigate(activeTab === 'lost' ? '/add-lost-pet' : '/add-found-pet');
    } else {
      navigate('/login');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-${activeTab}-pet/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab} pet report?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('petOwnerToken');
      await axios.delete(`http://localhost:5000/api/lost-and-found/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`${activeTab === 'lost' ? 'Lost' : 'Found'} pet report deleted successfully`);
      fetchPets();
    } catch (error) {
      toast.error(error.response?.data?.message || `Error deleting ${activeTab} pet report`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E6] to-[#FFF5E6] py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#80533b] mb-4">Lost & Found Pets</h1>
          <p className="text-lg text-gray-600">Help reunite lost pets with their families</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg transform transition-all duration-300 ${
                activeTab === 'lost'
                  ? 'bg-[#D08860] text-white'
                  : 'bg-white text-[#80533b] hover:bg-gray-100'
              }`}
            >
              <MapPin size={20} />
              Lost Pets
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg transform transition-all duration-300 ${
                activeTab === 'found'
                  ? 'bg-[#D08860] text-white'
                  : 'bg-white text-[#80533b] hover:bg-gray-100'
              }`}
            >
              <MapPin size={20} />
              Found Pets
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleAddPetClick}
            className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            {activeTab === 'lost' ? 'Report Lost Pet' : 'Report Found Pet'}
          </button>
          <button
            onClick={() => navigate('/search-lost-found-pets')}
            className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Search size={20} />
            Search {activeTab === 'lost' ? 'Lost' : 'Found'} Pets
          </button>
          <button
            onClick={() => navigate('/my-pet-reports')}
            className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <User size={20} />
            My Reports
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D08860] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No {activeTab} pets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative pt-[125%]">
                  {pet.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${pet.image}`}
                      alt={pet.petName}
                      className="absolute top-0 left-0 w-full h-full object-cover"
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
                      {activeTab === 'lost' ? 'Last Seen Location:' : 'Found Location:'}
                    </span>{' '}
                    {activeTab === 'lost' ? pet.lastSeenLocation : pet.foundLocation}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">
                      {activeTab === 'lost' ? 'Last Seen Date:' : 'Found Date:'}
                    </span>{' '}
                    {new Date(activeTab === 'lost' ? pet.lastSeenDate : pet.foundDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/pet-details/${pet._id}?type=${activeTab}`)}
                      className="bg-[#D08860] text-white px-4 py-2 rounded-lg hover:bg-[#80533b] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetLostandfound; 