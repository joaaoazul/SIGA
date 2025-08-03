import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../modules/shared/pages/Login';
import Register from '../modules/shared/pages/Register';
import AthleteSetup from '../modules/shared/pages/AthleteSetup';
import TestSupabase from '../modules/shared/pages/TestSupabase';
import NotFound from '../modules/shared/pages/NotFound';
import CreateAdmin from '../modules/shared/pages/CreateAdmin';
import ResetPassword from '../modules/shared/pages/ResetPassword';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      // No teu router
<Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/athlete-setup" element={<AthleteSetup />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/test-supabase" element={<TestSupabase />} />
      <Route path="*" element={<Navigate to="/404" />} />
 <Route path="/create-admin" element={<CreateAdmin />} />
    </Routes>
  );
};