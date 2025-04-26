import React from "react";
import EventForm from "../components/EventForm";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSave = async (eventData) => {
    try {
      // Validate required fields
      const requiredFields = ["title", "date", "time", "location", "description", "image"];
      const missingFields = requiredFields.filter(field => !eventData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      }

      // Transform data to match backend expectations
      const payload = {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        eventImageURL: eventData.image
      };

      // Send data to backend
      const response = await axios.post("http://localhost:5000/api/events/create", payload);

      if (response.data.success) {
        alert("Event created successfully!");
        navigate("/my-events"); // Redirect to events page after successful creation
      } else {
        throw new Error(response.data.message || "Failed to create event.");
      }
    } catch (error) {
      console.error("Event creation error:", error);
      alert(error.response?.data?.message || error.message || "Failed to create event. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5EFEA] flex flex-col">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D08860] rounded-full mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D08860] rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-transparent">
            <EventForm onSave={handleSave} />
          </div>
        </div>
      </div>

      {/* Footer placement */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default CreateEvent;
