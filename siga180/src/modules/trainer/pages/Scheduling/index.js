// src/modules/trainer/pages/Scheduling/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardView from './views/DashboardView';
import CalendarView from './views/CalendarView';
import CreateScheduleView from './views/CreateScheduleView';
import ListView from './views/ListView';
import EditScheduleView from './views/EditScheduleView';


// Componente temporário para views em desenvolvimento
const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">Em desenvolvimento...</p>
    </div>
  </div>
);

const SchedulingModule = () => {
  return (
    <Routes>
      {/* Rota principal - Dashboard */}
      <Route index element={<DashboardView />} />
      
      {/* Sub-rotas */}
      <Route path="dashboard" element={<DashboardView />} />
      <Route path="calendar" element={<CalendarView />} />
      <Route path="list" element={<ListView/>} />
      <Route path="create" element={<CreateScheduleView />} />
      <Route path="edit/:id" element={<EditScheduleView />} />
      <Route path="detail/:id" element={<ComingSoon title="Detalhes" />} />
      <Route path="availability" element={<ComingSoon title="Disponibilidade" />} />
      <Route path="recurring" element={<ComingSoon title="Recorrentes" />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/schedule" replace />} />
    </Routes>
  );
};

export default SchedulingModule;