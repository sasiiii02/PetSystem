import { Link, useNavigate } from "react-router-dom";

const EventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();

  // Function to handle navigating to Event Details page
  const handleViewDetails = () => {
    navigate(`/event/${event._id}`); // Use event._id for the event details navigation
  };

  // Function to handle updating the event
  const handleUpdate = () => {
    navigate(`/edit-event/${event._id}`); // Use event._id for the event update navigation
  };

  // Function to handle deleting the event
  const handleDelete = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this event?");
    if (isConfirmed) {
      onDelete(event._id); // Corrected: Pass event._id for deletion
    }
  };

  return (
    <div className="relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={event.eventImageURL} // Use event.eventImageURL to display the image
          alt={event.title}
          className="w-full h-48 object-cover"
          onClick={handleViewDetails}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80"></div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-amber-950 line-clamp-1">{event.title}</h3>
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#D08860]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {event.date} • {event.time}
          </p>
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#D08860]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 space-x-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-[#D08860] text-white px-4 py-2 rounded-lg hover:bg-[#C07650] transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Update</span>
          </button>

          <button
            onClick={handleViewDetails}
            className="flex-1 bg-[#D08860] text-white px-4 py-2 rounded-lg hover:bg-[#C07650] transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notification</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-[#D08860] text-white px-4 py-2 rounded-lg hover:bg-[#C07650] transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
