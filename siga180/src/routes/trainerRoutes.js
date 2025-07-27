// src/routes/TrainerRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas do Trainer
import Dashboard from '../modules/trainer/pages/Dashboard';
import Athletes from '../modules/trainer/pages/Athletes';
import AthleteDetail from '../modules/trainer/pages/AthleteDetail';
import AddAthlete from '../modules/trainer/pages/AddAthlete';
import AddAthleteFull from '../modules/trainer/pages/AddAthleteFull';
import EditAthlete from '../modules/trainer/pages/EditAthlete';
import WorkoutPlans from '../modules/trainer/pages/WorkoutPlans';
import Analytics from '../modules/trainer/pages/Analytics';

// IMPORTANTE: Importar o módulo Nutrition correto (pasta, não ficheiro)
import NutritionModule from '../modules/trainer/pages/Nutrition'; // Isto vai buscar o index.js da pasta

// Páginas Partilhadas
import Messages from '../modules/shared/pages/Messages';

export const TrainerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/athletes" element={<Athletes />} />
      <Route path="/athletes/new" element={<AddAthlete />} />
      <Route path="/athletes/new/full" element={<AddAthleteFull />} />
      <Route path="/athletes/:id" element={<AthleteDetail />} />
      <Route path="/athletes/:id/edit" element={<EditAthlete />} />
      <Route path="/workouts" element={<WorkoutPlans />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/nutrition/*" element={<NutritionModule />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
};