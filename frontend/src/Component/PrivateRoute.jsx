// src/Component/PrivateRoute.js
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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
};

export default PrivateRoute;