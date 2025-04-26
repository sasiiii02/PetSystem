import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import Footer from "../components/Footer";
import axios from "axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data.event); // Assuming your backend returns { event: {...} }
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate("/my-events");
      }
    };
  
    fetchEvent();
  }, [id, navigate]);

  const handleSave = async (eventData) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'date', 'time', 'location', 'description', 'image'];
      const missingFields = requiredFields.filter(field => !eventData[field]);
  
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }
  
      // Prepare the payload
      const payload = {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        eventImageURL: eventData.image
      };
  
      // Make PUT request to backend
      await axios.put(`http://localhost:5000/api/events/${id}`, payload);
      
      alert("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      console.error("Event update error:", error);
      alert(error.response?.data?.message || error.message || "Failed to update event. Please try again.");
    }
  };

  // Loading state
  if (!event) {
    return (
      <div className="min-h-screen bg-[#F5EFEA] flex items-center justify-center">
        <div className="text-[#D08860] text-2xl font-semibold animate-pulse">
          Loading event details...
        </div>
      </div>
    );
  }

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
            <EventForm event={event} onSave={handleSave} />
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

export default EditEvent;