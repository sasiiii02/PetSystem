import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventDetailsHeader from "../Component/EventDetailsHeader";
import RegisterEventModal from "../Component/RegisterEventModal";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("petOwnerToken"); // Changed from "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserEventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const token = localStorage.getItem("petOwnerToken"); // Changed from "token"

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventResponse = await api.get(`/events/${id}`);
      setEvent(eventResponse.data);

      if (token) {
        const [userResponse, regResponse] = await Promise.all([
          api.get("/users/profile"),
          api.get(`/registrations/event/${id}`),
        ]);
        setUser(userResponse.data);

        const userRegistrations = regResponse.data.registrations || [];
        const isUserRegistered = userRegistrations.some(
          (reg) =>
            reg.userId._id === userResponse.data._id &&
            reg.paymentStatus === "paid" &&
            reg.status === "active"
        );
        setIsRegistered(isUserRegistered);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("petOwnerToken"); // Changed from "token"
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token]);

  const handleRegisterClick = () => {
    if (!token) {
      setRegistrationError("Please log in to register for the event.");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
    setRegistrationError(null);
    setRegistrationSuccess(null);
  };

  const handleConfirmRegistration = async (formData) => {
    try {
      const response = await api.post(`/registrations/${id}/register`, {
        tickets: formData.tickets || 1,
      });

      if (response.data.success) {
        if (!localStorage.getItem("petOwnerToken")) { // Changed from "token"
          throw new Error("Authentication token missing. Please log in again.");
        }
        window.location.href = response.data.checkoutUrl;
      } else {
        setRegistrationError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegistrationError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during registration. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto mt-28 p-6">Loading event details...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto mt-28 p-6 text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="max-w-4xl mx-auto mt-28 p-6">Event not found</div>;
  }

  return (
    <div className="bg-amber-50 max-w-4xl mx-auto mt-28 p-6 shadow-md rounded-lg relative">
      <EventDetailsHeader event={event} />

      <div className="mt-6 flex flex-col items-center">
        {!isRegistered ? (
          <>
            <button
              onClick={handleRegisterClick}
              className="bg-amber-700 text-white px-6 py-2 text-lg rounded-lg hover:bg-amber-800 transition duration-200"
            >
              Register for Event
            </button>
            {registrationError && (
              <p className="text-red-500 mt-2">{registrationError}</p>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-semibold">
              ✅ You have successfully registered for this event!
            </p>
            {registrationSuccess && (
              <p className="text-green-600 mt-2">{registrationSuccess}</p>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <RegisterEventModal
          event={event}
          user={user}
          onConfirm={handleConfirmRegistration}
          onClose={() => {
            setIsModalOpen(false);
            setRegistrationError(null);
            fetchData();
          }}
          error={registrationError}
        />
      )}
    </div>
  );
};

export default UserEventDetailsPage;