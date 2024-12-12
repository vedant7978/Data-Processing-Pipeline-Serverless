import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isUserLoggedIn } = useAuth();

  // If the user is logged in, render the child components; otherwise, redirect to login
  return isUserLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;