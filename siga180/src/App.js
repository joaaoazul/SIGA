import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import Athletes from './pages/Athletes';
import AthleteDetail from './pages/AthleteDetail';
import AddAthlete from './pages/AddAthlete';
import AddAthleteFull from './pages/AddAthleteFull';
import EditAthlete from './pages/EditAthlete';
import AthleteSetup from './pages/AthleteSetup';
import WorkoutPlans from './pages/WorkoutPlans';
import Analytics from './pages/Analytics';
import Nutrition from './pages/Nutrition';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Contexts
import { AppProvider } from './context/AppContext';
import { AthleteProvider } from './context/AthleteContext';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/athlete-setup" element={
        <AthleteSetup />
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/athletes" element={
        <ProtectedRoute>
          <Athletes />
        </ProtectedRoute>
      } />
      <Route path="/athletes/new" element={
        <ProtectedRoute>
          <AddAthlete />
        </ProtectedRoute>
      } />
      <Route path="/athletes/new/full" element={
        <ProtectedRoute>
          <AddAthleteFull />
        </ProtectedRoute>
      } />
      <Route path="/athletes/:id" element={
        <ProtectedRoute>
          <AthleteDetail />
        </ProtectedRoute>
      } />
      <Route path="/athletes/:id/edit" element={
        <ProtectedRoute>
          <EditAthlete />
        </ProtectedRoute>
      } />
      <Route path="/workouts" element={
        <ProtectedRoute>
          <WorkoutPlans />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/nutrition" element={
        <ProtectedRoute>
          <Nutrition />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      
      {/* Settings Route */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Workout Detail Route */}
      <Route path="/workouts/:id" element={
        <ProtectedRoute>
          <WorkoutDetail />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AthleteProvider>
            <AppRoutes />
          </AthleteProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

// Placeholder components - remove when actual pages are created
const Settings = () => <div>Settings Page</div>;
const WorkoutDetail = () => <div>Workout Detail Page</div>;