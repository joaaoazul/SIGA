import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../modules/shared/pages/Login';
import Register from '../modules/shared/pages/Register';
import AthleteSetup from '../modules/shared/pages/AthleteSetup';
import NotFound from '../modules/shared/pages/NotFound';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/athlete-setup" element={<AthleteSetup />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};