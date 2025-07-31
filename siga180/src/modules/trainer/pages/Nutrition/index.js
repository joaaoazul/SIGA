import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Views existentes
import DashboardView from './views/DashboardView';
import AthletesView from './views/AthletesView';
import PlansView from './views/PlansView';
import MealsView from './views/MealsView';
import ToolsView from './views/ToolsView';
import DatabaseView from './views/DatabaseView';

// Views novas criadas
import AthleteDetailView from './views/AthleteDetailView';
import CreatePlanView from './views/CreatePlanView';
import EditPlanView from './views/EditPlanView';

// Novas funcionalidades
import MealTemplatesView from './views/MealTemplatesView';
import NutritionAnalyticsView from './views/NutritionAnalyticsView';
import ShoppingListGenerator from './views/ShoppingListGenerator';

const NutritionModule = () => {
  return (
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
      
      {/* Meals & Templates */}
      <Route path="meals" element={<MealsView />} />
      <Route path="templates" element={<MealTemplatesView />} />
      
      {/* Tools */}
      <Route path="tools" element={<ToolsView />} />
      <Route path="shopping-list" element={<ShoppingListGenerator />} />
      
      {/* Database */}
      <Route path="database" element={<DatabaseView />} />
      
      {/* Analytics */}
      <Route path="analytics" element={<NutritionAnalyticsView />} />
      
      
      {/* Redirect para dashboard se rota não existir */}
      <Route path="*" element={<Navigate to="/nutrition" replace />} />
    </Routes>
  );
};

export default NutritionModule;