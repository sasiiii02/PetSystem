import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EventForm({ event, onSave }) {
  const navigate = useNavigate();

  // Initialize the form data with the provided event or empty values
  const [eventData, setEventData] = useState({
    title: event?.title || "",
    date: event?.date || "",
    time: event?.time || "",
    location: event?.location || "",
    description: event?.description || "",
    image: event?.eventImageURL || event?.image || "",
  });

  const [error, setError] = useState("");

  // Validate the form to ensure all required fields are filled
  const validateForm = () => {
    const requiredFields = ['title', 'date', 'time', 'location', 'description'];
    const missingFields = requiredFields.filter(field => !eventData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    setError("");  // Clear error message on successful validation
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({ 
      ...prevData, 
      [name]: value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(eventData); // Call the onSave function passed from the parent component
    }
  };

  return (
    <section className="min-h-screen py-12 bg-[#F5EFEA]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#D08860] py-6 px-8">
            <h2 className="text-4xl font-bold text-white text-center">
              {event?._id ? "Edit Your Event" : "Create New Event"}
            </h2>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-950 mb-2">
                  Event Title
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={eventData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-950 mb-2">
                  Date
                </label>
                <input 
                  type="date" 
                  name="date" 
                  value={eventData.date} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
                />
              </div>
            </div>

            {/* Time and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-950 mb-2">
                  Time
                </label>
                <input 
                  type="time" 
                  name="time" 
                  value={eventData.time} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-950 mb-2">
                  Location
                </label>
                <input 
                  type="text" 
                  name="location" 
                  value={eventData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-amber-950 mb-2">
                Event Description
              </label>
              <textarea 
                name="description" 
                value={eventData.description} 
                onChange={handleChange} 
                required 
                rows="4" 
                placeholder="Describe your event"
                className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-amber-950 mb-2">
                Event Image URL
              </label>
              <input 
                type="url" 
                name="image" 
                value={eventData.image} 
                onChange={handleChange} 
                placeholder="Paste image URL (optional)"
                className="w-full px-4 py-3 border-2 border-[#D08860]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D08860] transition duration-300" 
              />
              {eventData.image && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={eventData.image} 
                    alt="Event Preview" 
                    className="max-w-xs max-h-60 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#D08860] text-white py-4 rounded-lg 
                           hover:bg-[#C07650] transition duration-300 
                           transform hover:scale-105 
                           shadow-lg hover:shadow-xl 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D08860]"
              >
                {event?._id ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
