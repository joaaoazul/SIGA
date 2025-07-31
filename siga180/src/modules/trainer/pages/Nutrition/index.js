import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout'; // Caminho corrigido!

// Import Views existentes
import DashboardView from './views/DashboardView';
import AthletesView from './views/AthletesView';
import PlansView from './views/PlansView';
import MealsView from './views/MealsView';
import ToolsView from './views/ToolsView';
import DatabaseView from './views/DatabaseView';

// Views que ainda podem estar em desenvolvimento
// Comenta se não existirem ainda
// import AnalyticsView from './views/AnalyticsView';

// Views novas criadas
import AthleteDetailView from './views/AthleteDetailView';
import CreatePlanView from './views/CreatePlanView';
import EditPlanView from './views/EditPlanView';

const NutritionModule = () => {
  return (
    <Layout title="Nutrição">
      <Routes>
        {/* Dashboard como default */}
        <Route index element={<DashboardView />} />
        <Route path="dashboard" element={<DashboardView />} />
        
        {/* Athletes */}
        <Route path="athletes" element={<AthletesView />} />
        <Route path="athlete/:id" element={<AthleteDetailView />} />
        
        {/* Plans */}
        <Route path="plans" element={<PlansView />} />
        <Route path="plans/create" element={<CreatePlanView />} />
        <Route path="plans/edit/:id" element={<EditPlanView />} />
        
        {/* Other views */}
        <Route path="meals" element={<MealsView />} />
        <Route path="tools" element={<ToolsView />} />
        <Route path="database" element={<DatabaseView />} />
        
        {/* Analytics - descomentar quando existir */}
        {/* <Route path="analytics" element={<AnalyticsView />} /> */}
        
        {/* Redirect paths antigos */}
        <Route path="*" element={<Navigate to="/nutrition" replace />} />
      </Routes>
    </Layout>
  );
};

export default NutritionModule;