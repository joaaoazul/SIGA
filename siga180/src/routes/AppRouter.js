import React from 'react';
import { useAuth } from '../modules/shared/hooks/useAuth';
import { TrainerRoutes } from './trainerRoutes'; // 👈 Corrige esta linha
import { AthleteRoutes } from './AthleteRoutes';
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
  
  // Por agora vamos usar TRAINER como default
  // Depois adicionas o role ao useAuth
  const userRole = user.role || 'TRAINER';
  
  switch (userRole) {
    case 'TRAINER':
      return <TrainerRoutes />;
    case 'ATHLETE':
      return <AthleteRoutes />;
    default:
      return <TrainerRoutes />;
  }
};