// src/modules/trainer/pages/Workouts/WorkoutsPage.js

import React, { useState, useEffect } from 'react';
import TemplatesView from './views/TemplatesView';
// Comentar temporariamente as views que ainda não existem
// import ActiveWorkoutView from './views/ActiveWorkoutView';
// import ExerciseLibraryView from './views/ExerciseLibraryView';

const WorkoutsPage = () => {
  const [currentView, setCurrentView] = useState('templates');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const startWorkout = (template = null) => {
    const workout = {
      id: Date.now(),
      templateId: template?.id || null,
      templateName: template?.name || 'Empty Workout',
      startTime: new Date(),
      exercises: template ? [...template.exercises] : [],
      athleteId: null,
    };

    setActiveWorkout(workout);
    setCurrentView('active');
    
    // Por agora, como não temos a ActiveWorkoutView, vamos só fazer log
    console.log('Workout iniciado:', workout);
    alert(`Treino "${workout.templateName}" iniciado! (Vista ainda não implementada)`);
  };

  const finishWorkout = async (workoutData) => {
    try {
      console.log('Saving workout:', workoutData);
      setActiveWorkout(null);
      setCurrentView('templates');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const renderView = () => {
    switch(currentView) {
      case 'templates':
        return (
          <TemplatesView 
            onStartWorkout={startWorkout}
            onNavigate={setCurrentView}
            onSelectTemplate={setSelectedTemplate}
          />
        );
      
      // Temporariamente simplificado
      case 'active':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Treino em Progresso</h2>
            <p className="text-gray-600 mb-4">Vista ainda não implementada</p>
            <button 
              onClick={() => setCurrentView('templates')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Voltar aos Templates
            </button>
          </div>
        );
      
      case 'exercises':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Biblioteca de Exercícios</h2>
            <p className="text-gray-600 mb-4">Vista ainda não implementada</p>
            <button 
              onClick={() => setCurrentView('templates')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Voltar aos Templates
            </button>
          </div>
        );
      
      default:
        return <TemplatesView onStartWorkout={startWorkout} onNavigate={setCurrentView} />;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeWorkout) {
        e.preventDefault();
        e.returnValue = 'Tem um treino em progresso. Tem certeza que deseja sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeWorkout]);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderView()}
    </div>
  );
};

export default WorkoutsPage;