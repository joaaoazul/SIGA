// src/routes/trainerRoutes.js
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
import Analytics from '../modules/trainer/pages/Analytics';

// Módulos
import NutritionModule from '../modules/trainer/pages/Nutrition';
import WorkoutsModule from '../modules/trainer/pages/Workouts';
import SchedulingModule from '../modules/trainer/pages/Scheduling'; // IMPORTANTE: Confirma que este ficheiro existe!

// Páginas Partilhadas
import Messages from '../modules/shared/pages/Messages';

// Página antiga temporária
import WorkoutPlansOld from '../modules/trainer/pages/WorkoutPlans';

export const TrainerRoutes = () => {
  return (
    <Layout title="180 Performance">
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Athletes */}
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/athletes/new" element={<AddAthlete />} />
        <Route path="/athletes/new/full" element={<AddAthleteFull />} />
        <Route path="/athletes/:id" element={<AthleteDetail />} />
        <Route path="/athletes/:id/edit" element={<EditAthlete />} />
        
        {/* Workouts - MÓDULO COMPLETO */}
        <Route path="/workouts/*" element={<WorkoutsModule />} />
        
        {/* Workouts OLD */}
        <Route path="/workouts-old" element={<WorkoutPlansOld />} />
        
        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Nutrition - MÓDULO COMPLETO */}
        <Route path="/nutrition/*" element={<NutritionModule />} />
        
        {/* SCHEDULE/SCHEDULING - CORRIGIDO COM /* NO FIM! */}
        <Route path="/schedule/*" element={<SchedulingModule />} />
        
        {/* Messages */}
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Layout>
  );
};