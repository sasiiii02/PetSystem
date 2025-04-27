import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Dog, Cat, Heart, CheckCircle, Camera, Upload, X } from 'lucide-react';

const EditPetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    ownerFirstName: '',
    ownerLastName: '',
    email: '',
    phone: '',
    petName: '',
    petAge: '',
    petGender: '',
    petBreed: '',
    petSpecies: '',
    petDescription: '',
    reason: '',
    specialNeeds: false,
    vaccinated: false,
    neutered: false,
    petImage: null
  });

  const petSpeciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  const petGenderOptions = ['Male', 'Female'];

  // Fetch pet data
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/foradoption/${id}`);
        setFormData(response.data);
        if (response.data.petImage) {
          setPreviewImage(`http://localhost:5000${response.data.petImage}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pet data:", err);
        setError("Failed to load pet data");
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        petImage: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ownerFirstName.trim()) newErrors.ownerFirstName = 'First name is required';
    if (!formData.ownerLastName.trim()) newErrors.ownerLastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits)';
    }
    
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.petAge.trim()) newErrors.petAge = 'Pet age is required';
    if (!formData.petGender) newErrors.petGender = 'Please select pet gender';
    if (!formData.petSpecies) newErrors.petSpecies = 'Please select pet species';
    if (!formData.petBreed.trim()) newErrors.petBreed = 'Pet breed is required';
    if (!formData.petDescription.trim()) newErrors.petDescription = 'Pet description is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason for giving up for adoption is required';

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = new FormData();
        // Only include pet-related fields, exclude owner information
        const petFields = [
          'petName',
          'petAge',
          'petGender',
          'petBreed',
          'petSpecies',
          'petDescription',
          'reason',
          'specialNeeds',
          'vaccinated',
          'neutered',
          'petImage'
        ];
        
        for (let key of petFields) {
          if (formData[key] !== null) {
            data.append(key, formData[key]);
          }
        }

        await axios.put(`http://localhost:5000/api/foradoption/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        setSubmissionStatus('success');
        setTimeout(() => {
          navigate('/pet-owner-dashboard');
        }, 2000);
      } catch (err) {
        console.error("Error updating pet:", err);
        setError("Failed to update pet listing");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B3704D] mx-auto"></div>
          <p className="mt-4 text-[#80533b]">Loading pet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <Heart className="text-[#80533b] mr-3" size={40} />
            <h2 className="text-3xl font-bold text-[#80533b]">Edit Pet Listing</h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <AlertCircle className="inline-block mr-2" size={20} />
              {error}
            </div>
          )}

          {submissionStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              <CheckCircle className="inline-block mr-2" size={20} />
              Pet listing updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Information */}
            <div className="bg-[#FFF5E6]/50 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-semibold text-[#80533b] mb-4">Owner Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ownerFirstName" className="block text-md font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="ownerFirstName"
                    name="ownerFirstName"
                    value={formData.ownerFirstName}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="ownerLastName" className="block text-md font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="ownerLastName"
                    name="ownerLastName"
                    value={formData.ownerLastName}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-md font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-md font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-[#FFF5E6]/50 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-semibold text-[#80533b] mb-4">Pet Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="petName" className="block text-md font-medium mb-2">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                  />
                </div>

                <div>
                  <label htmlFor="petAge" className="block text-md font-medium mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    id="petAge"
                    name="petAge"
                    value={formData.petAge}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="petSpecies" className="block text-md font-medium mb-2">
                    Species
                  </label>
                  <select
                    id="petSpecies"
                    name="petSpecies"
                    value={formData.petSpecies}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                  >
                    <option value="">Select Species</option>
                    {petSpeciesOptions.map(species => (
                      <option key={species} value={species}>{species}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="petGender" className="block text-md font-medium mb-2">
                    Gender
                  </label>
                  <select
                    id="petGender"
                    name="petGender"
                    value={formData.petGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                  >
                    <option value="">Select Gender</option>
                    {petGenderOptions.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="petBreed" className="block text-md font-medium mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  id="petBreed"
                  name="petBreed"
                  value={formData.petBreed}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div>
                <label htmlFor="petDescription" className="block text-md font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="petDescription"
                  name="petDescription"
                  value={formData.petDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                ></textarea>
              </div>

              <div>
                <label htmlFor="reason" className="block text-md font-medium mb-2">
                  Reason for Giving Up
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="specialNeeds"
                    name="specialNeeds"
                    checked={formData.specialNeeds}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#B3704D] focus:ring-[#D08860] border-gray-300 rounded"
                  />
                  <label htmlFor="specialNeeds" className="ml-3 text-md text-gray-900">
                    Special Needs
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#B3704D] focus:ring-[#D08860] border-gray-300 rounded"
                  />
                  <label htmlFor="vaccinated" className="ml-3 text-md text-gray-900">
                    Vaccinated
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="neutered"
                    name="neutered"
                    checked={formData.neutered}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#B3704D] focus:ring-[#D08860] border-gray-300 rounded"
                  />
                  <label htmlFor="neutered" className="ml-3 text-md text-gray-900">
                    Neutered
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="petImage" className="block text-md font-medium mb-2">
                  Pet Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Pet preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, petImage: null }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="petImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#B3704D] hover:text-[#D08860] focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="petImage"
                              name="petImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#D08860] to-[#B3704D] px-8 py-4 w-full
                         shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative flex items-center justify-center gap-2 z-10">
                  <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-semibold text-white">Update Pet Listing</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#B3704D] to-[#D08860] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPetForm; 