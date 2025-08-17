// src/routes/TrainerRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../modules/shared/components/layout/Layout';

// Páginas do Trainer
import Dashboard from '../modules/trainer/pages/Dashboard';
import Athletes from '../modules/trainer/pages/Athletes';
import AthleteDetail from '../modules/trainer/pages/AthleteDetail';
import AddAthlete from '../modules/trainer/pages/AddAthlete';
import AddAthleteFull from '../modules/trainer/pages/AddAthleteFull';
import EditAthlete from '../modules/trainer/pages/EditAthlete';
import WorkoutPlans from '../modules/trainer/pages/WorkoutPlans';
import WorkoutsModule from '../modules/trainer/pages/Workouts'; // ADICIONAR ESTA LINHA
import Analytics from '../modules/trainer/pages/Analytics';
import WorkoutsPage from '../modules/trainer/pages/Workouts/WorkoutsPage';
import WorkoutBuilder from '../modules/trainer/pages/Workouts/views/WorkoutBuilder';
import ExerciseManager from '../modules/trainer/pages/Workouts/views/ExerciseManager';


// IMPORTANTE: Importar o módulo Nutrition correto (pasta, não ficheiro)
import NutritionModule from '../modules/trainer/pages/Nutrition'; // Isto vai buscar o index.js da pasta

// Páginas Partilhadas
import Messages from '../modules/shared/pages/Messages';

export const TrainerRoutes = () => {
  return (
    <Layout title="180 Performance">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/athletes/new" element={<AddAthlete />} />
        <Route path="/athletes/new/full" element={<AddAthleteFull />} />
        <Route path="/athletes/:id" element={<AthleteDetail />} />
        <Route path="/athletes/:id/edit" element={<EditAthlete />} />
        <Route path="/workouts-old" element={<WorkoutPlans />} /> {/* RENOMEAR TEMPORARIAMENTE */}
        <Route path="/workouts/*" element={<WorkoutsModule />} /> {/* ADICIONAR NOVA ROTA */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/nutrition/*" element={<NutritionModule />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/exercises" element={<ExerciseManager />} />
        <Route path="/workouts/exercises/new" element={<ExerciseManager createMode />} />
        <Route path="/workouts/create" element={<WorkoutBuilder />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Layout>
  );
};