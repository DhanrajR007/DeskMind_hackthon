import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Placeholder for other routes */}
      <Route path="/dashboard" element={<div>Dashboard - Coming Soon</div>} />
    </Routes>
  );
};

export default AppRoutes;
