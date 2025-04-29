'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, CalendarCheck } from "lucide-react";

export default function VetAvailability() {
  const [availabilities, setAvailabilities] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        console.log("Fetching vet availabilities...");
        const response = await axios.get(
          "http://localhost:5000/api/appointments/veterinarian-Reqappointments",
          { timeout: 5000 }
        );
        console.log("Response:", response.data);
        const vetData = response.data.data || response.data;
        const dataArray = Array.isArray(vetData) ? vetData : [];
        setAvailabilities(dataArray);
        setFilteredAvailabilities(dataArray);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response ? err.response.data.error : err.message);
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAvailabilities(availabilities);
    } else {
      const filtered = availabilities.filter((availability) =>
        (availability.professionalName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAvailabilities(filtered);
    }
  }, [searchQuery, availabilities]);

  const handleAccept = async (id) => {
    try {
      if (!confirm("Are you sure you want to accept this availability?")) {
        return;
      }

      const response = await axios.patch(`http://localhost:5000/api/appointments/${id}/accept`);
      console.log("Accept response:", response.data);

      setAvailabilities(availabilities.filter((avail) => avail._id !== id));
      setFilteredAvailabilities(filteredAvailabilities.filter((avail) => avail._id !== id));

      alert("Request accepted and added to confirmed appointments!");
    } catch (err) {
      console.error("Accept error:", err);
      const errorMsg = err.response ? err.response.data.error : err.message;
      alert(`Failed to accept appointment: ${errorMsg}`);
    }
  };

  const handleDeny = async (id) => {
    try {
      if (!confirm("Are you sure you want to deny and delete this availability?")) {
        return;
      }

      const response = await axios.patch(`http://localhost:5000/api/appointments/${id}/deny`);
      console.log("Deny response:", response.data);

      setAvailabilities(availabilities.filter((avail) => avail._id !== id));
      setFilteredAvailabilities(filteredAvailabilities.filter((avail) => avail._id !== id));
    } catch (err) {
      console.error("Deny error:", err);
      const errorMsg = err.response ? err.response.data.error : err.message;
      alert(`Failed to deny appointment: ${errorMsg}`);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 bg-red-50 rounded-lg">
        <p className="font-semibold">Error loading vet availabilities</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
        <CalendarCheck className="mr-2 text-amber-600" size={24} />
        Vet Availability Requests
      </h2>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by professional name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-amber-950 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Professional Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Qualification</th> {/* Changed from Specialization to Qualification */}
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Given Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Given Time Slot</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Professional Fee</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Special Note</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredAvailabilities.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No vet availability requests found
                  </td>
                </tr>
              ) : (
                filteredAvailabilities.map((availability, index) => (
                  <tr
                    key={availability._id || index}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm">{availability.professionalName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{availability.specialization || "N/A"}</td> {/* Displays qualification */}
                    <td className="px-6 py-4 text-sm">{availability.email || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(availability.appointmentDate)}</td>
                    <td className="px-6 py-4 text-sm">
                      {availability.startTime || "N/A"} - {availability.endTime || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ${availability.chargePerAppointment?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-sm">{availability.specialNotes || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(availability._id)}
                          className="bg-[#D08860] text-white px-4 py-1 rounded-lg hover:bg-[#B77A4E] transition-colors duration-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeny(availability._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Deny
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}