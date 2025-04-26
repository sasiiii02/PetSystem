import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons components
const DogIcon = ({ isSelected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className={isSelected ? "text-white" : "text-blue-500"}>
    <path fill="currentColor" d="M496 96h-64l-7.16-14.31A32 32 0 0 0 396.22 64H342.6l-27.28-27.28C305.23 26.64 288 33.78 288 48.03v149.84l128 45.71V208h32c35.35 0 64-28.65 64-64v-32c0-8.84-7.16-16-16-16zm-112 48c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zM96 224c-17.64 0-32-14.36-32-32 0-17.67-14.33-32-32-32S0 174.33 0 192c0 41.66 26.83 76.85 64 90.1V496c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V384h160v112c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V277.55L266.05 224H96z"/>
  </svg>
);

const CatIcon = ({ isSelected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className={isSelected ? "text-white" : "text-purple-500"}>
    <path fill="currentColor" d="M290.59 192c-20.18 0-106.82 1.98-162.59 85.95V192c0-52.94-43.06-96-96-96-17.67 0-32 14.33-32 32s14.33 32 32 32c17.64 0 32 14.36 32 32v256c0 35.3 28.7 64 64 64h176c8.84 0 16-7.16 16-16v-16c0-17.67-14.33-32-32-32h-32l128-96v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V289.86c-10.29 2.67-20.89 4.54-32 4.54-61.81 0-113.52-44.05-125.41-102.4zM448 96h-64l-64-64v134.4c0 53.02 42.98 96 96 96s96-42.98 96-96V32l-64 64zm-72 80c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zm80 0c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z"/>
  </svg>
);

const AllPetsIcon = ({ isSelected }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className={isSelected ? "text-white" : "text-[#B3704D]"}>
    <path fill="currentColor" d="M256 224c-79.41 0-192 122.76-192 200.25 0 34.9 26.81 55.75 71.74 55.75 48.84 0 81.09-25.08 120.26-25.08 39.51 0 71.85 25.08 120.26 25.08 44.93 0 71.74-20.85 71.74-55.75C448 346.76 335.41 224 256 224zm-147.28-12.61c-10.4-34.65-42.44-57.09-71.56-50.13-29.12 6.96-44.29 40.69-33.89 75.34 10.4 34.65 42.44 57.09 71.56 50.13 29.12-6.96 44.29-40.69 33.89-75.34zm84.72-20.78c30.94-8.14 46.42-49.94 34.58-93.36s-46.52-72.01-77.46-63.87-46.42 49.94-34.58 93.36c11.84 43.42 46.53 72.02 77.46 63.87zm281.39-29.34c-29.12-6.96-61.15 15.48-71.56 50.13-10.4 34.65 4.77 68.38 33.89 75.34 29.12 6.96 61.15-15.48 71.56-50.13 10.4-34.65-4.77-68.38-33.89-75.34zm-156.27 29.34c30.94 8.14 65.62-20.45 77.46-63.87 11.84-43.42-3.64-85.21-34.58-93.36s-65.62 20.45-77.46 63.87c-11.84 43.42 3.64 85.22 34.58 93.36z"/>
  </svg>
);

const AdoptablePetList = () => {
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/adoptablepets');
        
        // Map API data to the format we need for display
        const formattedPets = response.data.map(pet => ({
          id: pet._id,
          name: pet.petName,
          type: pet.petSpecies,
          breed: pet.petBreed,
          age: pet.petAge,
          gender: pet.petGender,
          description: pet.petDescription,
          image: pet.petImage ? `http://localhost:5000${pet.petImage}` : null,
          vaccinated: pet.vaccinated,
          neutered: pet.neutered,
          specialNeeds: pet.specialNeeds
        }));
        
        setPets(formattedPets);
        setError(null);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Filter pets based on selection and search query
  const filteredPets = pets.filter(pet => {
    const matchesFilter = filter === 'All' || pet.type === filter;
    const matchesSearch = searchQuery === '' || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Render pet type icon
  const PetTypeIcon = ({ type, isSelected }) => {
    return type === 'Dog' 
      ? <DogIcon isSelected={isSelected} /> 
      : <CatIcon isSelected={isSelected} />;
  };

  // Handle Adopt Me button click
  const handleAdoptClick = (pet) => {
    navigate('/adopt', { 
      state: { 
        petName: pet.name, 
        petImage: pet.image,
        petType: pet.type
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <AllPetsIcon isSelected={true} />
          <p className="mt-2 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="bg-gradient-to-r from-[#D08860] to-[#B3704D] text-white px-4 py-2 rounded-full hover:shadow-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header section with title */}
        <div className="mb-6">
          <h2 className="mx-auto max-w-lg text-center text-5xl font-extrabold text-gray-900 leading-tight">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D]">Adoptable Pets</span>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pets by name, breed, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/80 border-2 border-[#D08860] focus:border-[#B3704D] focus:ring-2 focus:ring-[#D08860]/20 outline-none transition-all duration-300 shadow-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-[#B3704D]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filters and Pet Count Row */}
        <div className="container relative mx-auto mb-8">
          {/* Filter buttons - Absolute Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-6">
              {['All', 'Dog', 'Cat'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`
                    px-12 py-3 rounded-2xl flex items-center space-x-2
                    ${filter === type 
                      ? 'bg-gradient-to-r from-[#D08860] to-[#B3704D] text-white' 
                      : 'bg-white/50 text-[#B3704D] border-2 border-[#D08860]'}
                    hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                  `}
                >
                  {type === 'Dog' ? <DogIcon isSelected={filter === type} /> : 
                   type === 'Cat' ? <CatIcon isSelected={filter === type} /> : 
                   <AllPetsIcon isSelected={filter === type} />}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pet Count - Right Aligned */}
          <div className="flex justify-end">
            <div className="bg-white/90 backdrop-blur-sm px-8 py-2 rounded-2xl shadow-md border-2 border-[#D08860]/20 inline-flex items-center gap-3">
              <AllPetsIcon isSelected={false} />
              <div className="text-center">
                <p className="text-sm text-gray-500">Available Pets</p>
                <p className="text-2xl font-bold text-[#B3704D]">
                  {filteredPets.length}
                  <span className="text-gray-400 text-sm font-normal"> / {pets.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pet grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <div 
                key={pet.id} 
                className="bg-white/80 rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl flex flex-col h-full"
              >
                <div className="relative pt-[125%]">
                  <img 
                    src={pet.image} 
                    alt={pet.name} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-[#B3704D]">
                      {pet.name}
                    </h2>
                    <PetTypeIcon type={pet.type} isSelected={false} />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{pet.breed} • {pet.age} years old • {pet.gender}</p>
                  </div>
                  <p className="text-gray-700 mb-4">{pet.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pet.vaccinated && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Vaccinated</span>
                    )}
                    {pet.neutered && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Neutered</span>
                    )}
                    {pet.specialNeeds && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Special Needs</span>
                    )}
                  </div>
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleAdoptClick(pet)}
                      className="w-full bg-gradient-to-r from-[#D08860] to-[#B3704D] text-white py-3 rounded-2xl
                               hover:shadow-xl transition-all duration-300 
                               flex items-center justify-center space-x-2"
                    >
                      <AllPetsIcon isSelected={true} />
                      <span>Adopt Me</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No pets found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptablePetList;