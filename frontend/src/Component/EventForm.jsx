import { useState } from "react";

export default function EventForm({ event, onSave }) {
  // Initialize form data with event (for edit) or empty values (for create)
  const [eventData, setEventData] = useState({
    title: event?.title || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    location: event?.location || "",
    description: event?.description || "",
    maxAttendees: event?.maxAttendees || "",
    price: event?.price || "",
    eventImage: null, // File input for create/edit
    previewImage: event?.eventImageURL || "", // For displaying existing image
  });

  const [error, setError] = useState("");

  // Validate required fields
  const validateForm = () => {
    const requiredFields = ["title", "date", "time", "location", "description", "maxAttendees", "price"];
    const missingFields = requiredFields.filter((field) => !eventData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }

    // Validate maxAttendees and price are positive numbers
    if (isNaN(eventData.maxAttendees) || eventData.maxAttendees <= 0) {
      setError("Maximum attendees must be a positive number");
      return false;
    }
    if (isNaN(eventData.price) || eventData.price < 0) {
      setError("Price must be a non-negative number");
      return false;
    }

    setError("");
    return true;
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only JPEG and PNG images are allowed");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setEventData((prevData) => ({
        ...prevData,
        eventImage: file,
        previewImage: URL.createObjectURL(file), // Show preview
      }));
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(eventData); // Pass form data to parent (CreateEvent or EditEvent)
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 border border-amber-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D08860] to-[#B3704D] py-6 px-8 rounded-t-xl mb-6">
            <h2 className="text-3xl font-bold text-white text-center">
              {event?._id ? "Edit Your Event" : "Create New Event"}
            </h2>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-0 space-y-6">
            {/* Title and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Time and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2:30 PM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Max Attendees and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Maximum Attendees
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={eventData.maxAttendees}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter max attendees"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
              <div className="relative">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={eventData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Event Description
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your event"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
              />
            </div>

            {/* Event Image */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Event Image (JPEG/PNG, max 5MB)
              </label>
              <input
                type="file"
                name="eventImage"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D08860] focus:border-transparent text-base"
              />
              {eventData.previewImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={eventData.previewImage}
                    alt="Event Preview"
                    className="max-w-md max-h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-base font-medium mt-2">{error}</div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D08860] to-[#B3704D] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D08860] text-base font-medium"
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