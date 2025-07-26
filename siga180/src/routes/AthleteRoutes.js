import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Páginas do Atleta
import Dashboard from '../modules/athlete/pages/Dashboard';
import MyWorkouts from '../modules/athlete/pages/MyWorkouts';
import Progress from '../modules/athlete/pages/Progress';
import Nutrition from '../modules/athlete/pages/Nutrition';
import CheckIn from '../modules/athlete/pages/CheckIn';

// Páginas Partilhadas
import Messages from '../modules/shared/pages/Messages';

export const AthleteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/workouts" element={<MyWorkouts />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
};