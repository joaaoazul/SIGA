// src/modules/trainer/pages/Scheduling/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// VERSÃO SIMPLIFICADA SEM LAZY LOADING PARA TESTAR
import DashboardView from './views/DashboardView';
import CalendarView from './views/CalendarView';

// Views que ainda não existem - comentadas por agora
// import ListView from './views/ListView';
// import CreateScheduleView from './views/CreateScheduleView';
// import EditScheduleView from './views/EditScheduleView';
// import RecurringView from './views/RecurringView';
// import ScheduleDetailView from './views/ScheduleDetailView';
// import AvailabilityView from './views/AvailabilityView';
// import ConflictsView from './views/ConflictsView';
// import SettingsView from './views/SettingsView';

const SchedulingModule = () => {
  return (
    <Routes>
      {/* Vista padrão - Dashboard */}
      <Route index element={<DashboardView />} />
      
      {/* Rotas principais */}
      <Route path="dashboard" element={<DashboardView />} />
      <Route path="calendar" element={<CalendarView />} />
      
      {/* Rotas futuras - por agora redirecionam para o dashboard */}
      <Route path="list" element={<DashboardView />} />
      <Route path="create" element={<DashboardView />} />
      <Route path="edit/:id" element={<DashboardView />} />
      <Route path="detail/:id" element={<DashboardView />} />
      <Route path="recurring" element={<DashboardView />} />
      <Route path="availability" element={<DashboardView />} />
      <Route path="conflicts" element={<DashboardView />} />
      <Route path="settings" element={<DashboardView />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/scheduling" replace />} />
    </Routes>
  );
};

export default SchedulingModule;