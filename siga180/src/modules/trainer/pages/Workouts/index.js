// src/modules/trainer/pages/Workouts/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Views
import DashboardView from './views/DashboardView';
import TemplatesView from './views/TemplatesView';
import BuilderView from './views/BuilderView';
import AssignView from './views/AssignView';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';
import ExerciseLibraryView from './views/ExerciseLibraryView';
import SessionDetailView from './views/SessionDetailView';

const WorkoutsModule = () => {
  return (
    <Routes>
      {/* Dashboard como default */}
      <Route index element={<DashboardView />} />
      <Route path="dashboard" element={<DashboardView />} />
      
      {/* Templates */}
      <Route path="templates" element={<TemplatesView />} />
      <Route path="builder" element={<BuilderView />} />
      <Route path="builder/:id" element={<BuilderView />} />
      
      {/* Atribuições */}
      <Route path="assign" element={<AssignView />} />
      <Route path="assign/:templateId" element={<AssignView />} />
      
      {/* Calendário e Sessões */}
      <Route path="calendar" element={<CalendarView />} />
      <Route path="session/:id" element={<SessionDetailView />} />
      
      {/* Biblioteca de Exercícios */}
      <Route path="exercises" element={<ExerciseLibraryView />} />
      
      {/* Analytics */}
      <Route path="analytics" element={<AnalyticsView />} />
      
      {/* Redirect para dashboard se rota não existir */}
      <Route path="*" element={<Navigate to="/trainer/workouts" replace />} />
    </Routes>
  );
};

export default WorkoutsModule;