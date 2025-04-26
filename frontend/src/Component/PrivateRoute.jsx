import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, render the protected component; otherwise, redirect to login
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;