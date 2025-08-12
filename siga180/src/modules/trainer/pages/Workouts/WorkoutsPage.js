// src/modules/trainer/pages/Workouts/WorkoutsPage.js

import React, { useState, useEffect } from 'react';
import TemplatesView from './views/TemplatesView';
import ActiveWorkoutView from './views/ActiveWorkoutView';
import ExerciseLibraryView from './views/ExerciseLibraryView';

const WorkoutsPage = () => {
  const [currentView, setCurrentView] = useState('templates');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Função para iniciar um treino
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
  };

  // Função para terminar o treino
  const finishWorkout = async (workoutData) => {
    try {
      console.log('Saving workout:', workoutData);
      // TODO: Guardar na BD via Supabase
      
      setActiveWorkout(null);
      setCurrentView('templates');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  // Renderiza a vista apropriada
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
      
      case 'active':
        return activeWorkout ? (
          <ActiveWorkoutView 
            workout={activeWorkout}
            onFinish={finishWorkout}
            onCancel={() => {
              if (window.confirm('Tem certeza que deseja cancelar o treino?')) {
                setActiveWorkout(null);
                setCurrentView('templates');
              }
            }}
          />
        ) : null;
      
      case 'exercises':
        return (
          <ExerciseLibraryView 
            onBack={() => setCurrentView('templates')}
            onSelectExercise={(exercise) => {
              console.log('Selected exercise:', exercise);
              // TODO: Adicionar exercício ao treino ativo
            }}
          />
        );
      
      default:
        return <TemplatesView onStartWorkout={startWorkout} onNavigate={setCurrentView} />;
    }
  };

  // Prevenir saída acidental durante treino
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