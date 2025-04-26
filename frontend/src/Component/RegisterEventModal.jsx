import { useState } from "react";

const RegisterEventModal = ({ event, user, onConfirm, onClose, error }) => {
  const [tickets, setTickets] = useState(1);
  const availableTickets = event.maxAttendees - event.registeredTickets;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tickets < 1 || tickets > availableTickets) {
      return;
    }
    onConfirm({ tickets });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Register for {event.title}
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Price per Ticket:</span> ${event.price.toFixed(2)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Available Tickets:</span> {availableTickets}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total Cost:</span> ${(event.price * tickets).toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Tickets
          </label>
          <input
            type="number"
            min="1"
            max={availableTickets}
            value={tickets}
            onChange={(e) => setTickets(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={tickets < 1 || tickets > availableTickets}
            className={`px-4 py-2 rounded text-white font-medium transition-all ${
              tickets < 1 || tickets > availableTickets
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterEventModal;