// src/modules/trainer/pages/Workouts/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Views existentes
import DashboardView from './views/DashboardView';
import TemplatesView from './views/TemplatesView';

// Views temporárias até implementares
const BuilderView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Criar/Editar Treino</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 mb-4">Construtor de treinos em desenvolvimento...</p>
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const AssignView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Atribuir Treino</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Selecione o template e os atletas...</p>
    </div>
  </div>
);

const CalendarView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Calendário de Treinos</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-20 border rounded p-2 text-xs">
            Dia {i + 1}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics de Treinos</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Taxa de Conclusão</h3>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Progressão Média</h3>
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ExerciseLibraryView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Biblioteca de Exercícios</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Supino', 'Agachamento', 'Terra', 'Remada', 'Desenvolvimento', 'Rosca'].map(ex => (
        <div key={ex} className="bg-white rounded-lg shadow p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <h3 className="font-semibold">{ex}</h3>
          <p className="text-sm text-gray-600">Clique para ver detalhes</p>
        </div>
      ))}
    </div>
  </div>
);

const SessionDetailView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Detalhes da Sessão</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Informações da sessão de treino...</p>
    </div>
  </div>
);

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
      <Route path="*" element={<Navigate to="/workouts" replace />} />
    </Routes>
  );
};

export default WorkoutsModule;