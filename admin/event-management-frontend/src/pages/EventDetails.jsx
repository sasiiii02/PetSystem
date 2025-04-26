import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import EventDetailsHeader from "../components/EventDetailsHeader";
import AttendeeList from "../components/AttendeeList";
import SendNotification from "../components/SendNotification";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendeesLoading, setAttendeesLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // First fetch event details
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(eventResponse.data.event);
        
        // Then fetch attendees separately
        try {
          const attendeesResponse = await axios.get(`http://localhost:5000/api/registrations/event/${id}`);
          setAttendees(attendeesResponse.data.registrations || []);
        } catch (attendeesError) {
          console.error("Error fetching attendees:", attendeesError);
          setAttendees([]); // Set empty array if attendees fetch fails
        }
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load event data");
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
        setAttendeesLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const refreshAttendees = async () => {
    try {
      setAttendeesLoading(true);
      const response = await axios.get(`http://localhost:5000/api/registrations/event/${id}`);
      setAttendees(response.data.registrations || []);
    } catch (err) {
      console.error("Error refreshing attendees:", err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F5EFEA] min-h-screen flex flex-col">
        <div className="max-w-5xl w-full mx-auto mt-38 p-8 bg-white shadow-lg rounded-xl">
          <p className="text-center text-gray-500 mt-10">Loading event data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F5EFEA] min-h-screen flex flex-col">
        <div className="max-w-5xl w-full mx-auto mt-38 p-8 bg-white shadow-lg rounded-xl">
          <p className="text-center text-red-500 text-xl font-semibold">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-[#F5EFEA] min-h-screen flex flex-col">
        <div className="max-w-5xl w-full mx-auto mt-38 p-8 bg-white shadow-lg rounded-xl">
          <p className="text-center text-red-500 text-xl font-semibold">Event not found!</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFEA] min-h-screen flex flex-col">
      <div className="max-w-5xl w-full mx-auto mt-38 p-8 bg-white shadow-lg rounded-xl">
        <EventDetailsHeader event={event} />
        
        {/* AttendeeList will render even with empty attendees array */}
        <AttendeeList 
          attendees={attendees} 
          onRefresh={refreshAttendees} 
          eventId={id} 
          loading={attendeesLoading}
        />
        
        <SendNotification attendees={attendees} eventId={id} />
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;