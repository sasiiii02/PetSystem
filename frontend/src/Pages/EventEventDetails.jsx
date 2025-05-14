import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../Component/EventFooter";
import axios from "axios";
import EventDetailsHeader from "../Component/EventDetailsHeader";
import AttendeeList from "../Component/EventAttendeeList";
import SendNotification from "../Component/EventSendNotification";

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
        const eventResponse = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(eventResponse.data);

        try {
          const attendeesResponse = await axios.get(`http://localhost:5000/api/registrations/event/${id}`);
          setAttendees(attendeesResponse.data.registrations || []);
        } catch (attendeesError) {
          console.error("Error fetching attendees:", attendeesError);
          setAttendees([]);
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
      <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen flex flex-col pt-32 pb-20">
        <div className="max-w-5xl w-full mx-auto p-8 bg-white/80 rounded-2xl shadow-lg border border-amber-100">
          <p className="text-center text-gray-600 text-base">Loading event data...</p>
        </div>
        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen flex flex-col pt-32 pb-20">
        <div className="max-w-5xl w-full mx-auto p-8 bg-white/80 rounded-2xl shadow-lg border border-amber-100">
          <p className="text-center text-red-500 text-base font-medium">{error}</p>
        </div>
        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen flex flex-col pt-32 pb-20">
        <div className="max-w-5xl w-full mx-auto p-8 bg-white/80 rounded-2xl shadow-lg border border-amber-100">
          <p className="text-center text-red-500 text-base font-medium">Event not found!</p>
        </div>
        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const today = new Date("2025-05-14");
  const isPastEvent = eventDate < today;
  const eventStatus = isPastEvent ? "Past" : "Upcoming";
  const ticketStats = {
    registered: attendees.reduce((sum, attendee) => sum + attendee.tickets, 0),
    max: event.maxAttendees,
    percentage: event.maxAttendees > 0 ? (attendees.reduce((sum, attendee) => sum + attendee.tickets, 0) / event.maxAttendees) * 100 : 0,
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen flex flex-col pt-32 pb-20">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D]">Details</span>
          </h1>
          <Link
            to="/admin/redirect/event_manager/events"
            className="flex items-center px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl transition-colors border border-amber-200 shadow-md hover:shadow-lg transform hover:scale-105 duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>

        {/* Admin-Specific Event Summary */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-8 border border-amber-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Status:</span>{" "}
                <span className={`inline-block px-2 py-1 rounded-full text-sm ${isPastEvent ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                  {eventStatus}
                </span>
              </p>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Tickets Sold:</span> {ticketStats.registered} / {ticketStats.max} ({ticketStats.percentage.toFixed(1)}% filled)
              </p>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Total Revenue:</span> ${(ticketStats.registered * event.price).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Created At:</span> {new Date(event.createdAt).toLocaleDateString()}
              </p>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Last Updated:</span> {new Date(event.updatedAt).toLocaleDateString()}
              </p>
              <p className="text-base text-gray-600">
                <span className="font-medium text-gray-800">Pet Policy:</span> Dogs & Cats (1 pet + 1-2 people per ticket)
              </p>
            </div>
          </div>
        </div>

        {/* Existing EventDetailsHeader */}
        <EventDetailsHeader event={event} />
        <AttendeeList
          attendees={attendees}
          onRefresh={refreshAttendees}
          eventId={id}
          loading={attendeesLoading}
        />
        <SendNotification attendees={attendees} eventId={id} />
      </div>
      <div className="relative z-10 mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetails;