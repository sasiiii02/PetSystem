import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/notifications/user");
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        console.log("Fetched notifications:", response.data.notifications); // Debug log
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.message || "Error fetching notifications");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(
          notifications.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.patch("/notifications/read-all");
      if (response.data.success) {
        setNotifications(
          notifications.map((notif) => ({ ...notif, read: true }))
        );
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-28 p-6 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-amber-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-amber-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-amber-200 rounded"></div>
              <div className="h-4 bg-amber-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-28 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
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
      </div>
    );
  }

  const adminNotifications = notifications.filter(notif => notif.type === "admin");
  const userNotifications = notifications.filter(notif => notif.type === "user");

  return (
    <div className="max-w-6xl mx-auto mt-28 p-6">
      <div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
        <h1 className="text-3xl font-bold text-amber-900">My Notifications</h1>
        <div className="flex items-center gap-4">
          {(adminNotifications.some(notif => !notif.read) || userNotifications.some(notif => !notif.read)) && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
            >
              Mark All as Read
            </button>
          )}
          <Link
            to="/events"
            className="flex items-center px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-all border border-amber-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Browse Events
          </Link>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-amber-50 rounded-lg p-8 text-center shadow-sm border border-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 text-lg mb-6">You have no notifications at the moment.</p>
          <Link to="/events" className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            Discover Events
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {adminNotifications.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-amber-900 mb-4">Admin Notifications</h2>
              {adminNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 bg-amber-700 flex items-center justify-center w-full md:w-24 h-24 md:h-auto">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold">
                          {new Date(notification.createdAt).getDate()}
                        </div>
                        <div className="text-sm">
                          {new Date(notification.createdAt).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:flex-1 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {notification.eventId?.title || "Event"}
                        </h2>
                        <p className={`text-gray-600 ${notification.read ? "text-gray-500" : "font-semibold"}`}>
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-amber-700 hover:text-amber-800 text-sm font-semibold"
                          >
                            Mark as Read
                          </button>
                        )}
                        <Link
                          to={`/event/${notification.eventId?._id || '#'}`}
                          className="flex items-center bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Event
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userNotifications.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-amber-900 mb-4">My Actions (e.g., Refunds, Registrations)</h2>
              {userNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 bg-amber-700 flex items-center justify-center w-full md:w-24 h-24 md:h-auto">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold">
                          {new Date(notification.createdAt).getDate()}
                        </div>
                        <div className="text-sm">
                          {new Date(notification.createdAt).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:flex-1 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {notification.eventId?.title || "Event"}
                        </h2>
                        <p className={`text-gray-600 ${notification.read ? "text-gray-500" : "font-semibold"}`}>
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-amber-700 hover:text-amber-800 text-sm font-semibold"
                          >
                            Mark as Read
                          </button>
                        )}
                        <Link
                          to={`/event/${notification.eventId?._id || '#'}`}
                          className="flex items-center bg-amber-700 text-white px-3 py-1 rounded hover:bg-amber-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Event
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;