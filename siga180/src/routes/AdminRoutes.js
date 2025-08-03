// =============================================
// AdminRoutes.js - src/routes/AdminRoutes.js
// VERSÃO COMPLETA
// =============================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Usar o AdminLayout específico para admin
import AdminLayout from '../modules/admin/components/AdminLayout';

// Imports com lazy loading para melhor performance
const AdminDashboard = React.lazy(() => import('../modules/admin/pages/Dashboard'));
const UsersManagement = React.lazy(() => import('../modules/admin/pages/UsersManagement'));
const SystemSettings = React.lazy(() => import('../modules/admin/pages/SystemSettings'));
const ActivityLogs = React.lazy(() => import('../modules/admin/pages/ActivityLogs'));

// Componente de Loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);

export const AdminRoutes = () => {
  return (
    <AdminLayout>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/logs" element={<ActivityLogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </AdminLayout>
  );
};