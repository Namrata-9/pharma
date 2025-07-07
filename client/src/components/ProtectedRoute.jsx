// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
// src/utils/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? (
    <DashboardLayout>{element}</DashboardLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
