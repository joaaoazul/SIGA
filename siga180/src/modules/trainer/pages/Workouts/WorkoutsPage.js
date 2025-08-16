// src/modules/trainer/pages/Workouts/WorkoutsPage.js

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TemplatesView from './views/TemplatesView';
import WorkoutBuilder from './views/WorkoutBuilder';
import ActiveWorkout from './views/ActiveWorkoutView';
import { useAuth } from '../../../shared/hooks/useAuth';

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Determinar a vista baseada na URL
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/workouts/create')) {
      setCurrentView('create');
    } else if (path.includes('/workouts/edit')) {
      setCurrentView('edit');
    } else if (path.includes('/workouts/active')) {
      setCurrentView('active');
    } else {
      setCurrentView('templates');
    }
  }, [location]);

  // Handlers para navegação
  const handleStartWorkout = (template) => {
    if (template) {
      // Iniciar treino com template
      setSelectedTemplate(template);
      navigate(`/workouts/active/${template.id}`);
      setCurrentView('active');
    } else {
      // Treino livre sem template
      navigate('/workouts/active/free');
      setCurrentView('active');
    }
  };

  const handleNavigate = (page) => {
    switch (page) {
      case 'create':
        navigate('/workouts/create');
        setCurrentView('create');
        break;
      case 'builder':
        navigate('/workouts/create');
        setCurrentView('create');
        break;
      case 'templates':
        navigate('/workouts');
        setCurrentView('templates');
        break;
      default:
        navigate('/workouts');
        setCurrentView('templates');
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    navigate(`/workouts/edit/${template.id}`);
    setCurrentView('edit');
  };

  const handleSaveTemplate = async (templateData) => {
    // Lógica para guardar template
    console.log('Saving template:', templateData);
    // Após guardar, voltar para a lista
    navigate('/workouts');
    setCurrentView('templates');
  };

  const handleEndWorkout = () => {
    setSelectedTemplate(null);
    navigate('/workouts');
    setCurrentView('templates');
  };

  // Renderizar a vista apropriada
  const renderView = () => {
    switch (currentView) {
      case 'create':
        return (
          <WorkoutBuilder
            mode="create"
            onSave={handleSaveTemplate}
            onCancel={() => {
              navigate('/workouts');
              setCurrentView('templates');
            }}
          />
        );
      
      case 'edit':
        return (
          <WorkoutBuilder
            mode="edit"
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => {
              navigate('/workouts');
              setCurrentView('templates');
            }}
          />
        );
      
      case 'active':
        return (
          <ActiveWorkout
            template={selectedTemplate}
            onEndWorkout={handleEndWorkout}
          />
        );
      
      case 'templates':
      default:
        return (
          <TemplatesView
            onStartWorkout={handleStartWorkout}
            onNavigate={handleNavigate}
            onSelectTemplate={handleSelectTemplate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderView()}
    </div>
  );
};

export default WorkoutsPage;