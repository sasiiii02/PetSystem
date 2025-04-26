import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = io("http://localhost:5000"); // Connect to the backend server

  useEffect(() => {
    // Listen for a new user registration event
    socket.on("userRegistered", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("userRegistered");
    };
  }, [socket]);

  return (
    <div className="bg-[#F5EFEA] min-h-screen flex flex-col">
      <div className="max-w-5xl w-full mx-auto mt-28 p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="border-b py-4">
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
