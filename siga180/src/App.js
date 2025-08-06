import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './modules/shared/hooks/useAuth';

// Import pages
import Login from './modules/shared/pages/Login';

import ResetPassword from './modules/shared/pages/ResetPassword';
import TrainerDashboard from './modules/trainer/pages/Dashboard';
import AthleteDashboard from './modules/athlete/pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Reset Password Route */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes - Trainer */}
          <Route
            path="/trainer/*"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <Routes>
                  <Route path="dashboard" element={<TrainerDashboard />} />
                  {/* Adicionar outras rotas do trainer aqui */}
                  
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Athlete */}
          <Route
            path="/athlete/*"
            element={
              <ProtectedRoute allowedRoles={['athlete']}>
                <Routes>
                  <Route path="dashboard" element={<AthleteDashboard />} />
                  {/* Adicionar outras rotas do atleta aqui */}
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;