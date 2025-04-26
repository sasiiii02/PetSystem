import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import axios from 'axios';
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        console.log(response.data.events); // Debugging step: Log the events to see if they're fetched correctly
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);
  

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        // Make a DELETE request to the backend
        await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        
        // Remove the deleted event from the state
        setEvents(events.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5EFEA] flex flex-col">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D08860] rounded-full mix-blend-multiply filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D08860] rounded-full mix-blend-multiply filter blur-2xl"></div>
      </div>

      <div className="relative z-10 flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-amber-950">My Events</h2>
        
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} onDelete={handleDelete} />
              ))}

            </div>
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-xl">
              <p className="text-xl text-gray-700 mb-4">You have not created any events yet.</p>
              <Link 
                to="/create-event" 
                className="bg-[#D08860] text-white px-6 py-3 rounded-lg hover:bg-[#C07650] transition-colors inline-block"
              >
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyEvents;