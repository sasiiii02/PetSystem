import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function DoctorAvlCreateTable() {
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    specialNotes: "",
    chargePerAppointment: "",
    professionalType: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("profToken");

  useEffect(() => {
    if (!token) {
      console.log("No profToken found, redirecting to login");
      alert("No authentication token found. Please log in.");
      navigate("/professional/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired, redirecting to login");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("profToken");
        localStorage.removeItem("profRole");
        navigate("/professional/login");
        return;
      }
      // Remove the role restriction so all roles can access the form
      const role = decoded.role || decoded.type;
      if (!["vet", "groomer", "pet-trainer"].includes(role)) {
        console.log("Unauthorized role:", role);
        alert("Unauthorized role. Please log in with a valid professional account.");
        navigate("/professional/dashboard");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        doctorId: decoded.pID || decoded.id || "",
        professionalType: role, // Set professionalType based on the role
      }));
    } catch (error) {
      console.error("Invalid token:", error);
      alert("Invalid token. Please log in again.");
      localStorage.removeItem("profToken");
      localStorage.removeItem("profRole");
      navigate("/professional/login");
    }
    setIsLoading(false);
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.startTime >= formData.endTime) {
      alert("Start time must be before end time.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!token) {
        console.log("No profToken found in submit, redirecting to login");
        alert("No authentication token found. Please log in.");
        navigate("/professional/login");
        return;
      }
      const decoded = jwtDecode(token);
      console.log("Decoded token in submit:", decoded);
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired in submit, redirecting to login");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("profToken");
        localStorage.removeItem("profRole");
        navigate("/professional/login");
        return;
      }
      const role = decoded.role || decoded.type;
      if (!["vet", "groomer", "pet-trainer"].includes(role)) {
        console.log("Unauthorized role in submit:", role);
        alert("Unauthorized role. Please log in with a valid professional account.");
        navigate("/professional/dashboard");
        return;
      }
      const submissionData = {
        ...formData,
        professionalId: formData.doctorId,
        professionalType: role, // Ensure professionalType matches the role
        chargePerAppointment: Number(formData.chargePerAppointment),
      };
      console.log("Submission data:", submissionData);
      const response = await axios.post(
        "http://localhost:5000/api/appointments/ReqAvlTemp",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Availability request saved:", response.data);
      setFormData((prev) => ({
        ...prev,
        appointmentDate: "",
        startTime: "",
        endTime: "",
        specialNotes: "",
        chargePerAppointment: "",
        professionalType: role,
      }));
      alert("Availability request saved successfully!");
    } catch (error) {
      console.error("Error saving availability request:", error.response?.data, error.response?.status);
      if (error.response?.status === 401) {
        localStorage.removeItem("profToken");
        localStorage.removeItem("profRole");
        navigate("/professional/login");
      }
      alert(error.response?.data?.error || "Failed to save availability request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out, clearing profToken");
    localStorage.removeItem("profToken");
    localStorage.removeItem("profRole");
    navigate("/professional/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Map roles to display names for the dropdown
  const roleDisplayNames = {
    vet: "Veterinarian",
    groomer: "Groomer",
    "pet-trainer": "Pet Trainer",
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100 p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(252, 242, 233, 0.5), rgba(243, 231, 220, 0.5))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-6">
            <h2 className="text-xl font-semibold text-amber-950">
              Create Availability Request
            </h2>
            <p className="mt-1 text-sm text-amber-700">
              Please provide the availability details.
            </p>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-amber-800 hover:text-amber-900 mb-4"
            >
              Logout
            </button>
            <div className="mt-6 grid grid-cols-1 gap-y-6">
              <div>
                <label
                  htmlFor="doctor-id"
                  className="block text-sm font-medium text-amber-950"
                >
                  Professional ID
                </label>
                <input
                  id="doctor-id"
                  name="doctorId"
                  type="text"
                  value={formData.doctorId}
                  readOnly
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-amber-950 shadow-sm sm:text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="professional-type"
                  className="block text-sm font-medium text-amber-950"
                >
                  Professional Type
                </label>
                <select
                  id="professional-type"
                  name="professionalType"
                  value={formData.professionalType}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-amber-950 shadow-sm sm:text-sm cursor-not-allowed"
                >
                  <option value={formData.professionalType}>
                    {roleDisplayNames[formData.professionalType]}
                  </option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="appointment-date"
                  className="block text-sm font-medium text-amber-950"
                >
                  Availability Date
                </label>
                <input
                  id="appointment-date"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-amber-950 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="start-time"
                  className="block text-sm font-medium text-amber-950"
                >
                  Start Time
                </label>
                <input
                  id="start-time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-amber-950 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-sm font-medium text-amber-950"
                >
                  End Time
                </label>
                <input
                  id="end-time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-amber-950 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="charge-per-appointment"
                  className="block text-sm font-medium text-amber-950"
                >
                  Charge Per Appointment ($)
                </label>
                <input
                  id="charge-per-appointment"
                  name="chargePerAppointment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.chargePerAppointment}
                  onChange={handleInputChange}
                  placeholder="Enter appointment charge"
                  required
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-amber-950 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="special-notes"
                  className="block text-sm font-medium text-amber-950"
                >
                  Special Notes
                </label>
                <textarea
                  id="special-notes"
                  name="specialNotes"
                  rows={3}
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-amber-950 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  placeholder="Enter any special notes (optional)"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-x-4">
          <button
            type="button"
            className="text-sm font-semibold text-amber-800 hover:text-amber-900"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                appointmentDate: "",
                startTime: "",
                endTime: "",
                specialNotes: "",
                chargePerAppointment: "",
                professionalType: formData.professionalType,
              }))
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-700"
          >
            {isSubmitting ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </form>
    </div>
  );
}