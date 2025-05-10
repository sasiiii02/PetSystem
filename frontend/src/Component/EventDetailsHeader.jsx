import { FaClock, FaMapMarkerAlt, FaTicketAlt, FaUsers, FaCheckCircle } from "react-icons/fa";

const EventDetailsHeader = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate tickets remaining
  const maxAttendees = event.maxAttendees || 0;
  const registeredTickets = event.registeredTickets || 0;
  const ticketsRemaining = Math.max(0, maxAttendees - registeredTickets);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <img
          src={event.eventImageURL || "/default-event.jpg"}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => (e.target.src = "/default-event.jpg")}
        />
      </div>

      <h2 className="text-3xl font-bold text-amber-900 mb-4">{event.title}</h2>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center">
          <FaClock className="text-amber-600 mr-2" size={16} />
          <span>
            {formattedDate} at {event.time}
          </span>
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-amber-600 mr-2" size={16} />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center">
          <FaTicketAlt className="text-amber-600 mr-2" size={16} />
          <span>${event.price?.toFixed(2) || "Free"} per ticket</span>
        </div>
        <div className="flex items-center">
          <FaUsers className="text-amber-600 mr-2" size={16} />
          <span>Max Participants: {maxAttendees}</span>
        </div>
        <div className="flex items-center">
          <FaCheckCircle className="text-amber-600 mr-2" size={16} />
          <span>Tickets Remaining: {ticketsRemaining}</span>
        </div>
      </div>

      <p className="mt-6 text-gray-700">{event.description}</p>
    </div>
  );
};

export default EventDetailsHeader;