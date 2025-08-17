// siga180/src/routes/AppRouter.js

import React from 'react';
import { useAuth } from '../modules/shared/hooks/useAuth';

// Imports das rotas
import { TrainerRoutes } from './trainerRoutes'; // t minúsculo!
import { AthleteRoutes } from './AthleteRoutes';
import { PublicRoutes } from './PublicRoutes';

// Debug Component (opcional - pode remover depois)
import DebugAuth from '../modules/shared/components/DebugAuth';

// Loading Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E8ECE3]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-[#333333] rounded"></div>
          </div>
        </div>
        <div className="flex space-x-2 justify-center mb-4">
          <div className="h-3 w-3 bg-[#333333] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-3 w-3 bg-[#333333] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
          <div className="h-3 w-3 bg-[#333333] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        </div>
        <p className="text-gray-600">A carregar...</p>
      </div>
    </div>
  );
};

export const AppRouter = () => {
  const { user, loading } = useAuth();
  
  // Debug logs (remover em produção)
  console.log('🔍 AppRouter Render:', { 
    loading, 
    userExists: !!user, 
    userEmail: user?.email,
    userRole: user?.role 
  });
  
  // Loading State
  if (loading) {
    return (
      <>
        <LoadingScreen />
        <DebugAuth />
      </>
    );
  }
  
  // No User - Public Routes
  if (!user) {
    console.log('👤 No user - showing PublicRoutes');
    return (
      <>
        <PublicRoutes />
        <DebugAuth />
      </>
    );
  }
  
  // Get user role
  const userRole = user.role || user.user_metadata?.role || 'athlete';
  console.log('👤 User role:', userRole);
  
  // Render routes based on role
  if (userRole === 'trainer') {
    console.log('📍 Loading TrainerRoutes');
    return (
      <>
        <TrainerRoutes />
        <DebugAuth />
      </>
    );
  } else {
    // Default para athlete (inclui admin ou qualquer outro role)
    console.log('📍 Loading AthleteRoutes');
    return (
      <>
        <AthleteRoutes />
        <DebugAuth />
      </>
    );
  }
};