import { useEffect, useState } from "react";
import UserEventCard from "../Component/UserEventCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCalendar, FaFilter, FaPaw, FaBell } from "react-icons/fa";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("petOwnerToken"); // Change to petOwnerToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("petOwnerToken");

  const theme = {
    primary: "bg-[#D08860]",
    secondary: "bg-[#B3714E]",
    textPrimary: "text-white",
    textSecondary: "text-amber-950",
    accent: "bg-amber-100",
    border: "border-amber-200",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/events/");
        const fetchedEvents = response.data;
        if (!Array.isArray(fetchedEvents)) {
          throw new Error("Invalid response format from server");
        }
        const activeEvents = fetchedEvents.filter(event => event.status.toLowerCase() === "active");
        setEvents(activeEvents);
        setFilteredEvents(activeEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get("/notifications/user");
          if (response.data.success) {
            const notifications = response.data.notifications;
            const unread = notifications.filter(notif => !notif.read).length;
            setUnreadCount(unread);
            setHasNotifications(notifications.length > 0);
          }
        } catch (err) {
          console.error("Error fetching notifications:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      };
      fetchNotifications();
    } else {
      setUnreadCount(0);
      setHasNotifications(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const results = events.filter((event) =>
        (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         event.location?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEvents(results);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const handleViewRegisteredEvents = () => {
    if (token) {
      navigate("/my-events");
    } else {
      alert("Please log in to view your registered events.");
      navigate("/login");
    }
  };

  const handleViewNotifications = () => {
    if (token) {
      navigate("/notifications");
    } else {
      alert("Please log in to view your notifications.");
      navigate("/login");
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className={`${theme.accent} rounded-2xl p-6 md:p-10 mb-8 shadow-md`}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-amber-900">Upcoming Pet Events</h1>
          <p className="text-center text-amber-800 mb-6 max-w-2xl mx-auto">
            Join our community events and connect with fellow pet lovers. Find workshops, adoption drives, and fun gatherings for you and your furry friends.
          </p>

          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <button className={`px-4 py-2 rounded-full shadow-md flex items-center ${theme.primary} ${theme.textPrimary} hover:${theme.secondary} transition-all duration-300`}>
              <FaPaw className="mr-2" /> All Events
            </button>
            <button className="px-4 py-2 rounded-full shadow-md flex items-center bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-300">
              <FaFilter className="mr-2" /> Filter
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleViewRegisteredEvents}
              disabled={!token}
              className={`px-6 py-3 rounded-full ${theme.textPrimary} font-medium transition-all duration-300 shadow-md flex items-center ${
                token
                  ? `${theme.primary} hover:${theme.secondary} transform hover:scale-105`
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <FaCalendar className="mr-2" />
              My Registered Events
            </button>
            <button
              onClick={handleViewNotifications}
              disabled={!token}
              className={`px-6 py-3 rounded-full ${theme.textPrimary} font-medium transition-all duration-300 shadow-md flex items-center relative ${
                token
                  ? `${theme.primary} hover:${theme.secondary} transform hover:scale-105`
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <FaBell className="mr-2" />
              My Notifications
              {token && unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
              {token && unreadCount === 0 && hasNotifications && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full h-3 w-3 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-500">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg text-amber-900 font-medium">
              {searchTerm ? "Search Results" : "All Events"}
            </h3>
            <span className={`${theme.accent} text-amber-800 px-4 py-1 rounded-full text-sm font-medium`}>
              {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} {searchTerm && "Found"}
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-[#D08860]`}></div>
          </div>
        ) : (
          <>
            {filteredEvents.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <UserEventCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <img
                  src="/empty-events.svg"
                  alt="No events"
                  className="w-40 h-40 mx-auto mb-4 opacity-60"
                />
                <p className="text-lg text-gray-600">
                  {searchTerm ? "No events match your search criteria" : "No events available at the moment."}
                </p>
                <p className="text-gray-500 mt-2">
                  {searchTerm ? "Try using different keywords" : "Check back soon for upcoming pet events!"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserEventsPage;