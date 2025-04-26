import { useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaArrowRight, FaTicketAlt } from "react-icons/fa";

const UserEventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/event/${event._id}`);
  };

  const theme = {
    primary: "bg-[#D08860]",
    secondary: "bg-[#B3714E]",
    textPrimary: "text-white",
    textSecondary: "text-amber-950",
    accent: "bg-amber-100",
    border: "border-amber-200",
  };

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isSoldOut = event.registeredTickets >= event.maxAttendees;

  const handleImageError = (e) => {
    e.target.src = "/default-event.jpg";
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-lg bg-white flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-100 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={event.eventImageURL || "/default-event.jpg"}
          alt={event.title}
          className="w-full h-56 object-cover cursor-pointer"
          onClick={handleViewDetails}
          onError={handleImageError}
        />
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">
          {formattedDate}
        </div>
        {isSoldOut && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Sold Out
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
        </div>

        <div className="flex items-center mb-3">
          <FaClock className="text-gray-400 mr-2" size={14} />
          <span className="text-sm text-gray-600">{event.time}</span>
        </div>

        <div className="flex items-center mb-3">
          <FaMapMarkerAlt className="text-gray-400 mr-2" size={14} />
          <span className="text-sm text-gray-600">{event.location}</span>
        </div>

        <div className="flex items-center mb-4">
          <FaTicketAlt className="text-gray-400 mr-2" size={14} />
          <span className="text-sm text-gray-600">
            ${event.price?.toFixed(2) || "Free"} / ticket
            {event.maxAttendees && ` (${event.maxAttendees - event.registeredTickets} left)`}
          </span>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleViewDetails}
            disabled={isSoldOut}
            className={`w-full py-2.5 text-center font-medium rounded-lg transition-all flex items-center justify-center ${
              isSoldOut
                ? "bg-gray-400 cursor-not-allowed"
                : `${theme.primary} ${theme.textPrimary} hover:${theme.secondary}`
            }`}
          >
            {isSoldOut ? "Sold Out" : "View Details"} {!isSoldOut && <FaArrowRight className="ml-2" size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEventCard;