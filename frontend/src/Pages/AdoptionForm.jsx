import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Dog, Cat, Heart, CheckCircle } from 'lucide-react';

const PetAdoptionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { petName, petImage, petType } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    petType: petType || '',
    preferredPet: petName || '',
    homeType: '',
    hasYard: false,
    otherPets: false,
    employmentStatus: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const petTypes = ['Dog', 'Cat', 'Either'];
  const homeTypes = ['House', 'Apartment', 'Condo', 'Other'];
  const employmentStatuses = ['Employed', 'Self-Employed', 'Student', 'Retired', 'Unemployed'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
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

    if (!formData.petType) newErrors.petType = 'Please select a pet type';
    if (!formData.homeType) newErrors.homeType = 'Please select home type';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Please select employment status';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Set submission status to success
      setSubmissionStatus('success');
      
      // Optional: Navigate after a delay or reset form
      setTimeout(() => {
        // Either navigate to another page
        navigate('/Submit_adoption_Form');
        // Or reset the form and submission status
        // setFormData({ ... }); // Reset to initial state
        // setSubmissionStatus(null);
      }, 3000);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
        <CheckCircle className="mx-auto mb-6 text-green-500" size={80} />
        <h2 className="text-3xl font-bold text-[#80533b] mb-4">Application Submitted!</h2>
        <p className="text-xl mb-6">
          Thank you, {formData.firstName}! Your pet adoption application has been successfully submitted.
        </p>
        <p className="text-md text-gray-600 mb-6">
          We will review your application and contact you soon.
        </p>
        <button 
          onClick={() => setSubmissionStatus(null)}
          className="bg-[#B3704D] text-white px-8 py-3 rounded-xl hover:bg-[#D08860] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      {submissionStatus === 'success' && <SuccessMessage />}
      
      <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] pt-24 flex items-center justify-center p-6">
        <div className="w-full max-w-10xl bg-white shadow-2xl rounded-3xl overflow-hidden flex border-2 border-[] mt-6">
          {/* Pet Details Section */}
          <div className="w-1/2 relative">
            {petImage ? (
              <img 
                src={petImage} 
                alt={petName || "Pet"} 
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <img 
                src="/api/placeholder/800/1200" 
                alt="Pet Adoption" 
                className="w-full h-full object-cover absolute inset-0"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[]/60 to-[]/60 flex items-center justify-center">
              <div className="text-white text-center p-8">
                {petName && (
                  <div>
                    <h2 className="text-4xl font-bold mb-4">
                      {petName} is Waiting for You!
                    </h2>
                    <p className="text-xl mb-4">
                      {petType === 'Dog' ? <Dog className="inline mr-2" size={32} /> : <Cat className="inline mr-2" size={32} />}
                      {petType} Adoption
                    </p>
                  </div>
                )}
                <p className="text-xl">Open your heart and home to a loving pet today</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-1/2 p-12 overflow-y-auto bg-white">
            <div className="flex items-center justify-center mb-8">
              <Heart className="text-[#80533b] mr-3" size={50} />
              <h2 className="text-3xl font-bold text-[#80533b]">Pet Adoption Application</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-md font-medium text-[] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.firstName ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-md font-medium text-[] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.lastName ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-md font-medium text-[] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.email ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-md font-medium text-[] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(+94) 456-7890"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.phone ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="petType" className="block text-md font-medium text-[] mb-2">
                    Preferred Pet Type
                  </label>
                  <select
                    id="petType"
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.petType ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  >
                    <option value="">Select Pet Type</option>
                    {petTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.petType && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.petType}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="preferredPet" className="block text-md font-medium text-[] mb-2">
                    Preferred Pet Name
                  </label>
                  <input
                    type="text"
                    id="preferredPet"
                    name="preferredPet"
                    value={formData.preferredPet}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[] focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                    placeholder="Selected Pet Name"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="homeType" className="block text-md font-medium text-[] mb-2">
                    Home Type
                  </label>
                  <select
                    id="homeType"
                    name="homeType"
                    value={formData.homeType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.homeType ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  >
                    <option value="">Select Home Type</option>
                    {homeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.homeType && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.homeType}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="employmentStatus" className="block text-md font-medium text-[] mb-2">
                    Employment Status
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.employmentStatus ? 'border-red-500' : 'border-[]'
                    } focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md`}
                  >
                    <option value="">Select Employment Status</option>
                    {employmentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.employmentStatus && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-2" size={18} /> {errors.employmentStatus}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasYard"
                    name="hasYard"
                    checked={formData.hasYard}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#B3704D] focus:ring-[#D08860] border-gray-300 rounded"
                  />
                  <label htmlFor="hasYard" className="ml-3 text-md text-gray-900">
                    Do you have a yard?
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="otherPets"
                    name="otherPets"
                    checked={formData.otherPets}
                    onChange={handleChange}
                    className="h-5 w-5 text-[#B3704D] focus:ring-[#D08860] border-gray-300 rounded"
                  />
                  <label htmlFor="otherPets" className="ml-3 text-md text-gray-900">
                    Do you have other pets?
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-md font-medium text-[] mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={5}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[] focus:outline-none focus:ring-2 focus:ring-[#B3704D] transition-all duration-300 hover:shadow-md"
                  placeholder="Tell us why you want to adopt a pet..."
                ></textarea>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#B3704D] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#D08860] transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Dog className="mr-3" size={24} /> Submit Adoption Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetAdoptionForm;