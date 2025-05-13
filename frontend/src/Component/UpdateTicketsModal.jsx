import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("petOwnerToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const UpdateTicketsModal = ({ registration, onConfirm, onClose }) => {
  const [tickets, setTickets] = useState(registration.tickets);
  const [error, setError] = useState(null);
  const availableTickets =
    registration.eventId.maxAttendees - registration.eventId.registeredTickets + registration.tickets;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tickets < 1 || tickets > availableTickets) {
      setError("Invalid ticket count");
      return;
    }
    if (tickets === registration.tickets) {
      setError("No change in ticket count");
      return;
    }
    try {
      const response = await api.patch(
        `/registrations/${registration._id}/update-tickets`,
        { newTickets: tickets }
      );
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl; // Redirect to Stripe
      } else {
        alert(
          `Tickets updated to ${tickets}. Refund: $${response.data.refundAmount.toFixed(2)}`
        );
        onConfirm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update tickets");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Update Tickets for {registration.eventId.title}
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Price per Ticket:</span> ${registration.eventId.price.toFixed(2)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Available Tickets:</span> {availableTickets}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Current Tickets:</span> {registration.tickets}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total Cost:</span> ${(registration.eventId.price * tickets).toFixed(2)}
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

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 Bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
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
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicketsModal;