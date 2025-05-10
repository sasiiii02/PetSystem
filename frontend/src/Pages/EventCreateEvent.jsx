import React from "react";
import EventForm from "../Component/EventForm";
import Footer from "../Component/EventFooter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSave = async (eventData) => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("maxAttendees", eventData.maxAttendees);
      formData.append("price", eventData.price);
      if (eventData.eventImage) {
        formData.append("eventImage", eventData.eventImage);
      }

      // Send POST request to backend
      const response = await axios.post("http://localhost:5000/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Event created successfully!");
      navigate("/admin/redirect/event_manager/events");
    } catch (error) {
      console.error("Event creation error:", error);
      alert(error.response?.data?.message || error.message || "Failed to create event. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
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