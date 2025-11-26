import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    // user not logged in → kick back to login
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
