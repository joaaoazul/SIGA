// src/modules/trainer/pages/Workouts/index.js
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Loading Component
const LoadingView = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">A carregar...</p>
    </div>
  </div>
);

// Lazy load todas as views para melhor performance
const DashboardView = lazy(() => import('./views/DashboardView'));
const TemplatesView = lazy(() => import('./views/TemplatesView'));
const BuilderView = lazy(() => import('./views/BuilderView'));
const AssignView = lazy(() => import('./views/AssignView'));
const CalendarView = lazy(() => import('./views/CalendarView'));
const ExerciseLibraryView = lazy(() => import('./views/ExerciseLibraryView'));
const SessionDetailView = lazy(() => import('./views/SessionDetailView'));
const VideoReviewView = lazy(() => import('./views/VideoReviewView'));
const AthleteProgressView = lazy(() => import('./views/AthletesProgressView'));


const WorkoutsModule = () => {
  return (
    <Suspense fallback={<LoadingView />}>
      <Routes>
        {/* Dashboard - Vista principal */}
        <Route index element={<DashboardView />} />
        <Route path="dashboard" element={<DashboardView />} />
        
        {/* Templates - Gestão de templates */}
        <Route path="templates" element={<TemplatesView />} />
        <Route path="templates/:id" element={<SessionDetailView />} />
        
        {/* Builder - Criar/Editar treinos */}
        <Route path="builder" element={<BuilderView />} />
        <Route path="builder/:id" element={<BuilderView />} />
        
        {/* Assign - Atribuir treinos */}
        <Route path="assign" element={<AssignView />} />
        <Route path="assign/:templateId" element={<AssignView />} />
        
        {/* Calendar - Calendário de sessões */}
        <Route path="calendar" element={<CalendarView />} />
        <Route path="calendar/:date" element={<CalendarView />} />
        
        {/* Sessions - Detalhes de sessões */}
        <Route path="session/:id" element={<SessionDetailView />} />
        <Route path="session/:id/execute" element={<SessionDetailView mode="execute" />} />
        
        {/* Exercises - Biblioteca de exercícios */}
        <Route path="exercises" element={<ExerciseLibraryView />} />
        <Route path="exercises/new" element={<BuilderView mode="exercise" />} />
        <Route path="exercises/:id" element={<ExerciseLibraryView />} />
        
        
        {/* Progress - Progressão de atletas */}
        <Route path="progress" element={<AthleteProgressView />} />
        <Route path="progress/:athleteId" element={<AthleteProgressView />} />
        <Route path="progress/:athleteId/:exerciseId" element={<AthleteProgressView />} />
        
        {/* Videos - Revisão de vídeos */}
        <Route path="videos" element={<VideoReviewView />} />
        <Route path="videos/:videoId" element={<VideoReviewView />} />
        
        {/* Settings - Configurações do módulo */}
        {/* Redirect para dashboard se rota não existir */}
        <Route path="*" element={<Navigate to="/workouts" replace />} />
      </Routes>
    </Suspense>
  );
};

export default WorkoutsModule;