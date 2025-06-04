import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMyContext } from '../contexts/AuthContext';

const ProtectRoute = () => {
  const { user ,loading} = useMyContext();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;
