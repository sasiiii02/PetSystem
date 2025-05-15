import { useState, useEffect } from "react";
import AppointmentForm from "./AppointmentForm";
import { FaUser, FaPhone, FaEnvelope, FaPaw, FaCalendar, FaClock, FaSearch, FaStar, FaMedal, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

export default function UserAppointmentCard() {
  const [activeSection, setActiveSection] = useState("vet");
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [professionalForDetails, setProfessionalForDetails] = useState(null);
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentFee, setAppointmentFee] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [filter, setFilter] = useState("week");
  const [error, setError] = useState(null);

  const theme = {
    primary: "bg-[#D08860]",
    secondary: "bg-[#B3714E]",
    textPrimary: "text-white",
    textSecondary: "text-amber-950",
    accent: "bg-amber-100",
    border: "border-amber-200",
  };

  useEffect(() => {
    fetchProfessionals();
  }, [activeSection, filter]);

  const fetchProfessionals = async () => {
    try {
      const backendUrl = `http://localhost:5000/api/appointments/list?role=${activeSection}&filter=${filter}`;
      console.log("Fetching professionals with URL:", backendUrl);
      const response = await fetch(backendUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", {
        "Content-Type": response.headers.get("Content-Type"),
        "Server": response.headers.get("Server"),
      });
      if (!response.ok) {
        const text = await response.text();
        console.log("Raw response:", text.substring(0, 200));
        throw new Error(`HTTP error! status: ${response.status} - ${text.substring(0, 50)}`);
      }

      if (!response.headers.get("Content-Type")?.includes("application/json")) {
        const text = await response.text();
        console.log("Non-JSON response:", text.substring(0, 200));
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log("Parsed data:", data);
      setProfessionals(
        data.map((prof) => ({
          id: prof.pID || "Unknown",
          name: prof.pName || "Unknown",
          title: prof.qualification || "Not specified",
          description: prof.specialNotes || "No special notes",
          fee: prof.chargePerAppointment || 0,
          imgSrc: prof.profilePicture || "https://via.placeholder.com/300x200",
          availableTime: prof.availableTime || "Not specified",
          appointmentDate: prof.appointmentDate || "Not specified",
          experience: prof.experience || "Not specified",
        }))
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching professionals:", error.message);
      setError(`Failed to fetch professionals: ${error.message}. Ensure the backend is running at http://localhost:5000 and serving /api/appointments/list.`);
    }
  };

  const handleViewDetails = (professional) => {
    setProfessionalForDetails(professional);
    setIsViewingDetails(true);
    setIsBooking(false); // Ensure booking form is hidden
  };

  const handleBookAppointment = (professional, type, fee) => {
    setSelectedProfessional(professional);
    setAppointmentType(type);
    setAppointmentFee(fee);
    setIsBooking(true);
    setIsViewingDetails(false); // Hide professional details modal
  };

  const handleCloseModal = () => {
    setIsViewingDetails(false);
    setIsBooking(false);
    setProfessionalForDetails(null);
  };

  const filteredProfessionals = () => {
    return professionals.filter(
      (prof) =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const categoryIcons = {
    vet: <FaMedal className="mr-2" />,
    groomer: <FaPaw className="mr-2" />,
    "pet-trainer": <FaCheckCircle className="mr-2" />,
  };

  return (
    <div className="relative max-w-6xl mx-auto p-4 md:p-8 pt-24">
      {/* Main content with conditional blur */}
      <div className={isViewingDetails || isBooking ? "filter blur-lg" : ""}>
        <div className={`${theme.accent} rounded-2xl p-6 md:p-10 mb-8 shadow-md mt-30`}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-amber-900">Pet Care Professionals</h1>
          <p className="text-center text-amber-800 mb-6 max-w-2xl mx-auto">
            Find the perfect specialist for your furry friend. Our certified professionals provide the highest quality care.
          </p>
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, title or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {["today", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setFilter(period)}
                className={`px-4 py-2 rounded-full ${filter === period ? `${theme.primary} ${theme.textPrimary}` : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["vet", "groomer", "pet-trainer"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 text-lg font-semibold rounded-full transition-all duration-300 shadow-md flex items-center ${
                activeSection === section
                  ? `${theme.primary} ${theme.textPrimary}`
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {categoryIcons[section]}
              {section.charAt(0).toUpperCase() + section.slice(1)}s
            </button>
          ))}
        </div>

        <div className="block">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
              Our {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}s
            </h2>
            <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium">
              {filteredProfessionals().length} Available
            </span>
          </div>

          {error && <div className="text-center text-red-500 mb-4">{error}</div>}

          {filteredProfessionals().length === 0 && !error ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No professionals match your search. Try different keywords.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals().map((prof) => (
                <ProfessionalCard
                  key={prof.id}
                  {...prof}
                  onViewDetails={() => handleViewDetails(prof)}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for professional details */}
      {isViewingDetails && !isBooking && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
          <div className="max-w-3xl w-full mx-4">
            <ProfessionalDetails
              professional={professionalForDetails}
              theme={theme}
              onClose={handleCloseModal}
              onBook={() => handleBookAppointment(professionalForDetails, activeSection, professionalForDetails.fee)}
            />
          </div>
        </div>
      )}

      {/* Appointment Form */}
      {isBooking && !isViewingDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
          <div className="max-w-5xl w-11/12 mx-auto">
            <AppointmentForm
              professional={selectedProfessional}
              appointmentType={appointmentType}
              appointmentFee={appointmentFee}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfessionalCard({ id, imgSrc, name, title, description, fee, onViewDetails, theme, availableTime, appointmentDate }) {
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <div className="overflow-hidden rounded-xl shadow-lg bg-white flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-100 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img src={imgSrc} alt={name} className="w-full h-56 object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs font-semibold">{id}</div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <h4 className="text-sm text-gray-500">{title}</h4>
          </div>
          <div className={`${theme.primary} ${theme.textPrimary} text-sm px-3 py-1 rounded-full font-medium`}>${fee}</div>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"} size={14} />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">{rating}/5</span>
        </div>

        <p className="text-sm text-gray-600 mb-2">Special Notes: {description || "No special notes"}</p>
        <p className="text-sm text-gray-600 mb-2">Available Time: {availableTime || "Not specified"}</p>
        <p className="text-sm text-gray-600 mb-2">Date: {appointmentDate || "Not specified"}</p>

        <div className="mt-auto">
          <button
            onClick={onViewDetails}
            className={`w-full py-2.5 text-center font-medium rounded-lg transition-all ${theme.primary} ${theme.textPrimary} hover:${theme.secondary} flex items-center justify-center`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfessionalDetails({ professional, theme, onClose, onBook }) {
  return (
    <div className="p-8 shadow-xl rounded-xl bg-white border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={professional.imgSrc}
            alt={professional.name}
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">{professional.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{professional.title}</p>

          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Experience:</span> {professional.experience || "Not specified"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Special Notes:</span> {professional.description || "No special notes"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Fee:</span> ${professional.fee || 0}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Available Time:</span> {professional.availableTime || "Not specified"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span> {professional.appointmentDate || "Not specified"}
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={onBook}
              className={`flex-1 py-3 text-center font-medium rounded-lg transition-all ${theme.primary} ${theme.textPrimary} hover:${theme.secondary} flex items-center justify-center`}
            >
              <FaCalendar className="mr-2" /> Book Now
            </button>
            <button
              onClick={onClose}
              className={`flex-1 py-3 text-center font-medium rounded-lg transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center`}
            >
              <FaArrowLeft className="mr-2" /> Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}