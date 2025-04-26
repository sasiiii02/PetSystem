import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Heart } from 'lucide-react';

const PetRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    breed: '',
    petBYear: '',
    vaccinations: '',
    specialNotes: '',
    petimage: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/pets/registerPet', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Pet registered:', response.data);
      navigate('/pets'); // Redirect to a pets list page or dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering pet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex items-center justify-center p-6 sm:p-12 mt-12">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section: Image */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
          <div
            className="absolute inset-0 bg-[url('./assets/staffRegister.jpg')] bg-cover bg-center flex items-center justify-center"
          >
            <div className="text-white text-center p-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Register Your Pet</h2>
              <p className="text-lg sm:text-xl">Add your pet to our family</p>
            </div>
          </div>
        </div>

        {/* Right Section: Registration Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 overflow-y-auto max-h-screen">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <Heart className="text-[#B3704D] mr-3" size={32} />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#B3704D]">Pet Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Pet Name"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
            </div>

            {/* Breed */}
            <div>
              <label htmlFor="breed" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Breed
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]" placeholder="Breed"/>
            </div>

            {/* Birth Year */}
            <div>
              <label htmlFor="petBYear" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Birth Year
              </label>
              <input
                type="number"
                id="petBYear"
                name="petBYear"
                value={formData.petBYear}
                onChange={handleChange}
                required
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Birth Year"
              />
            </div>

            {/* Vaccinations */}
            <div>
              <label htmlFor="vaccinations" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Vaccinations
              </label>
              <input
                type="text"
                id="vaccinations"
                name="vaccinations"
                value={formData.vaccinations}
                onChange={handleChange}
                required
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Vaccinations"
              />
            </div>

            {/* Special Notes */}
            <div>
              <label htmlFor="specialNotes" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Special Notes
              </label>
              <textarea
                id="specialNotes"
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Special Notes"
                rows="4"
              />
            </div>

            {/* Pet Image URL */}
            <div>
              <label htmlFor="petimage" className="block text-sm sm:text-md font-medium text-gray-700 mb-2">
                Pet Image URL
              </label>
              <input
                type="text"
                id="petimage"
                name="petimage"
                value={formData.petimage}
                onChange={handleChange}
                className="w-full px-4 py-1.5 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9a7656]"
                placeholder="Pet Image URL"
              />
            </div>

            {/* Submission Error */}
            {error && (
              <p className="text-center text-sm text-red-500 flex items-center justify-center">
                <AlertCircle className="mr-2" size={18} /> {error}
              </p>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full bg-[#B3704D] text-white px-8 py-3 sm:py-4 rounded-xl text-md sm:text-lg font-semibold hover:bg-[#4E2D21] transition-colors"
              >
                Register Pet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetRegister;