import { useState } from "react";
import AppointmentForm from "./AppointmentForm";
import { FaUser, FaPhone, FaEnvelope, FaPaw, FaCalendar, FaClock, FaSearch, FaStar, FaMedal, FaCheckCircle } from "react-icons/fa";

export default function PetServices() {
  const [activeSection, setActiveSection] = useState("veterinarian");
  const [isBooking, setIsBooking] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentFee, setAppointmentFee] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Theme settings - keeping the same colors
  const theme = {
    primary: "bg-[#D08860]",
    secondary: "bg-[#B3714E]",
    textPrimary: "text-white",
    textSecondary: "text-amber-950",
    accent: "bg-amber-100",
    border: "border-amber-200",
  };

  const handleBookAppointment = (professional, type, fee) => {
    setSelectedProfessional(professional);
    setAppointmentType(type);
    setAppointmentFee(fee);
    setIsBooking(true);
  };

  // Filter professionals based on search term
  const filteredProfessionals = (category) => {
    return professionals[category].filter(
      (prof) =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Icons for each category
  const categoryIcons = {
    veterinarian: <FaMedal className="mr-2" />,
    groomer: <FaPaw className="mr-2" />,
    trainer: <FaCheckCircle className="mr-2" />
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24">
      {isBooking ? (
        <AppointmentForm
          professional={selectedProfessional}
          appointmentType={appointmentType}
          appointmentFee={appointmentFee}
          onClose={() => setIsBooking(false)}
        />
      ) : (
        <>
          {/* Hero Section */}
          <div className={`${theme.accent} rounded-2xl p-6 md:p-10 mb-8 shadow-md mt-30`}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-amber-900">Pet Care Professionals</h1>
            <p className="text-center text-amber-800 mb-6 max-w-2xl mx-auto">
              Find the perfect specialist for your furry friend. Our certified professionals provide the highest quality care.
            </p>
            
            {/* Search Bar */}
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
          </div>

          {/* Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {["veterinarian", "groomer", "trainer"].map((section) => (
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

          {/* Sections */}
          {["veterinarian", "groomer", "trainer"].map((category) => (
            <div
              key={category}
              className={activeSection === category ? "block" : "hidden"}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900">
                  Our {category.charAt(0).toUpperCase() + category.slice(1)}s
                </h2>
                <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium">
                  {filteredProfessionals(category).length} Available
                </span>
              </div>

              {filteredProfessionals(category).length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No professionals match your search. Try different keywords.</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProfessionals(category).map((prof) => (
                    <ProfessionalCard
                      key={prof.id}
                      {...prof}
                      onBook={() => handleBookAppointment(prof, category, prof.fee)}
                      theme={theme}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Enhanced Card Component
function ProfessionalCard({ id, imgSrc, name, title, description, fee, onBook, theme }) {
  // Generate random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);
  
  return (
    <div className="overflow-hidden rounded-xl shadow-lg bg-white flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-100 group">
      {/* Image with overlay gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
          {id}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <h4 className="text-sm text-gray-500">{title}</h4>
          </div>
          <div className={`${theme.primary} ${theme.textPrimary} text-sm px-3 py-1 rounded-full font-medium`}>
            ${fee}
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"} size={14} />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">{rating}/5</span>
        </div>
        
        <p className={`text-sm text-gray-600 mb-4`}>{description}</p>
        
        {/* Button at the bottom */}
        <div className="mt-auto">
          <button
            onClick={onBook}
            className={`w-full py-2.5 text-center font-medium rounded-lg transition-all ${theme.primary} ${theme.textPrimary} hover:${theme.secondary} flex items-center justify-center`}
          >
            <FaCalendar className="mr-2" /> Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

// Sample Data with 6 Professionals in Each Category
const professionals = {
  veterinarian: [
    { id: "VET001", imgSrc: "/vet1.jpg", name: "Dr. Sarah Johnson", title: "Veterinary Surgeon", description: "Specializes in small animal surgery with 10 years of experience.", fee: 65 },
    { id: "VET002", imgSrc: "/vet2.jpg", name: "Dr. Michael Chen", title: "Feline Specialist", description: "Expert in cat health and behavior with 15 years of experience.", fee: 70 },
    { id: "VET003", imgSrc: "/vet3.jpg", name: "Dr. Emily Wilson", title: "Emergency Care", description: "Available 24/7 for urgent pet medical needs.", fee: 85 },
    { id: "VET004", imgSrc: "/vet4.jpg", name: "Dr. David Kim", title: "Orthopedic Specialist", description: "Specializes in bone fractures and joint surgeries.", fee: 90 },
    { id: "VET005", imgSrc: "/vet5.jpg", name: "Dr. Olivia Martinez", title: "Dermatology", description: "Treats skin allergies and infections in pets.", fee: 75 },
    { id: "VET006", imgSrc: "/vet6.jpg", name: "Dr. Robert Taylor", title: "Senior Pet Care", description: "Focuses on geriatric pet health and pain management.", fee: 70 },
    { id: "VET007", imgSrc: "/vet7.jpg", name: "Dr. Sophia Patel", title: "Exotic Animals", description: "Specialist in birds, reptiles, and exotic mammals.", fee: 80 },
    { id: "VET008", imgSrc: "/vet8.jpg", name: "Dr. James Wilson", title: "Nutrition Specialist", description: "Creates customized diet plans for pets with health conditions.", fee: 65 },
    { id: "VET009", imgSrc: "/vet9.jpg", name: "Dr. Lisa Rodriguez", title: "Behavioral Specialist", description: "Helps with anxiety, aggression, and other behavioral issues.", fee: 75 },
    { id: "VET010", imgSrc: "/vet10.jpg", name: "Dr. John Smith", title: "General Practice", description: "Comprehensive care for all your pet's health needs.", fee: 60 }
  ],
  groomer: [
    { id: "GROOM001", imgSrc: "/groomer1.jpg", name: "Emma Johnson", title: "Professional Groomer", description: "Expert in stylish pet grooming with gentle handling.", fee: 45 },
    { id: "GROOM002", imgSrc: "/groomer2.jpg", name: "James Wilson", title: "Luxury Stylist", description: "Provides high-end grooming for show pets.", fee: 65 },
    { id: "GROOM003", imgSrc: "/groomer3.jpg", name: "Sophia Davis", title: "Mobile Groomer", description: "Comes to your home for stress-free grooming.", fee: 70 },
    { id: "GROOM004", imgSrc: "/groomer4.jpg", name: "David Thompson", title: "Breed Specialist", description: "Expert in breed-standard cuts for all dog types.", fee: 55 },
    { id: "GROOM005", imgSrc: "/groomer5.jpg", name: "Olivia Smith", title: "Puppy Specialist", description: "Special gentle approach for puppies' first grooming.", fee: 50 },
    { id: "GROOM006", imgSrc: "/groomer6.jpg", name: "Michael Brown", title: "Cat Groomer", description: "Patient and experienced with feline clients.", fee: 60 },
    { id: "GROOM007", imgSrc: "/groomer7.jpg", name: "Ava Garcia", title: "Therapeutic Groomer", description: "Special care for pets with anxiety or special needs.", fee: 65 },
    { id: "GROOM008", imgSrc: "/groomer8.jpg", name: "Daniel Lee", title: "Creative Stylist", description: "Expert in creative coloring and fun pet styles.", fee: 80 },
    { id: "GROOM009", imgSrc: "/groomer9.jpg", name: "William Clark", title: "Senior Pet Groomer", description: "Gentle grooming for older pets with mobility issues.", fee: 55 },
    { id: "GROOM010", imgSrc: "/groomer10.jpg", name: "Rachel Kim", title: "Deshedding Expert", description: "Reduces shedding with specialized techniques.", fee: 65 }
  ],
  trainer: [
    { id: "TRAIN001", imgSrc: "/trainer1.jpg", name: "Mike Reynolds", title: "Obedience Trainer", description: "Teaches basic commands and good manners.", fee: 50 },
    { id: "TRAIN002", imgSrc: "/trainer2.jpg", name: "Jessica Adams", title: "Agility Trainer", description: "Prepares pets for competitions and obstacle courses.", fee: 70 },
    { id: "TRAIN003", imgSrc: "/trainer3.jpg", name: "Christopher Lee", title: "Service Dog Trainer", description: "Trains assistance dogs for people with disabilities.", fee: 90 },
    { id: "TRAIN004", imgSrc: "/trainer4.jpg", name: "Amanda Wilson", title: "Puppy Trainer", description: "Helps puppies develop good manners and confidence.", fee: 55 },
    { id: "TRAIN005", imgSrc: "/trainer5.jpg", name: "Ryan Park", title: "Therapy Dog Trainer", description: "Prepares dogs for hospital and nursing home visits.", fee: 75 },
    { id: "TRAIN006", imgSrc: "/trainer6.jpg", name: "Nicole Garcia", title: "Behavior Specialist", description: "Works with aggressive or fearful dogs.", fee: 80 },
    { id: "TRAIN007", imgSrc: "/trainer7.jpg", name: "Kevin Brown", title: "Trick Trainer", description: "Teaches fun tricks and advanced commands.", fee: 60 },
    { id: "TRAIN008", imgSrc: "/trainer8.jpg", name: "Rachel Kim", title: "Off-Leash Expert", description: "Trains reliable recall and off-leash control.", fee: 70 },
    { id: "TRAIN009", imgSrc: "/trainer9.jpg", name: "Jason Miller", title: "Protection Trainer", description: "Trains personal protection dogs (qualified homes only).", fee: 95 },
    { id: "TRAIN010", imgSrc: "/trainer10.jpg", name: "Lauren Taylor", title: "Canine Fitness", description: "Improves strength and mobility through exercises.", fee: 65 }
  ]
};