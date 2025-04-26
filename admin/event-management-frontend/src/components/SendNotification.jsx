import React, { useState } from "react";
import { io } from "socket.io-client";

const SendNotification = () => {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const socket = io("http://localhost:5000");

  const handleSendNotification = () => {
    if (message.trim()) {
      const notification = {
        id: Date.now(),
        message,
        time: new Date().toLocaleString(),
      };

      // Emit the notification to the backend
      socket.emit("sendNotification", notification);
      
      // Add to local notifications list
      setNotifications([notification, ...notifications]);
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-2xl font-bold text-amber-950 mb-6">Send Notifications</h3>
      
      <div className="relative mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08860] focus:border-transparent transition-all resize-none"
          placeholder="Write your message to the attendees..."
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {message.length}/500
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 items-center">
        <span className="text-sm text-gray-500">
          {message.trim().length > 0 ? 'Ready to send' : 'Compose a message'}
        </span>
        <button
          onClick={handleSendNotification}
          disabled={!message.trim()}
          className="bg-[#D08860] text-white px-6 py-2 rounded-lg hover:bg-[#B7704E] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          <span>Send Notification</span>
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-amber-950 mb-4">Sent Notifications</h4>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#D08860]"
              >
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SendNotification;