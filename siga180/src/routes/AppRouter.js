import React from 'react';
import { useAuth } from '../modules/shared/hooks/useAuth';
import { TrainerRoutes } from './trainerRoutes';
import { AthleteRoutes } from './AthleteRoutes';
import { AdminRoutes } from './AdminRoutes';
import { PublicRoutes } from './PublicRoutes';

export const AppRouter = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) return <PublicRoutes />;
  
  // Obter role do user
  const userRole = user.role || user.user_metadata?.role || 'athlete';
  
  switch (userRole) {
    case 'admin':
      return <AdminRoutes />;
    case 'trainer':
      return <TrainerRoutes />;
    case 'athlete':
      return <AthleteRoutes />;
    default:
      return <PublicRoutes />;
  }
};