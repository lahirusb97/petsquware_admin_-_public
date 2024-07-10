import React from "react";
import { useAuthContext } from "./context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const AdminProtected = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (user) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
};

export default AdminProtected;
