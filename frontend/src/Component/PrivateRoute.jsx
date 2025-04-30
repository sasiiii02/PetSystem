import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

<<<<<<< Updated upstream
  // If token exists, render the protected component; otherwise, redirect to login
  return token ? children : <Navigate to="/" replace />;
=======
  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role for Appointment Manager routes
  if (
    location.pathname.startsWith("/admin/redirect/appointment_manager") &&
    user.role !== "appointment_manager"
  ) {
    return <Navigate to="/stafflogin" replace />;
  }

  // Check role for Event Admin routes
  if (
    location.pathname.startsWith("/admin/redirect/event_admin") &&
    user.role !== "event_admin"
  ) {
    return <Navigate to="/stafflogin" replace />;
  }

  // Check role for User Admin routes (if applicable)
  if (
    location.pathname.startsWith("/admin/redirect/user_admin") &&
    user.role !== "user_admin"
  ) {
    return <Navigate to="/stafflogin" replace />;
  }

  return children;
>>>>>>> Stashed changes
};

export default PrivateRoute;