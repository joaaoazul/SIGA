// src/modules/trainer/pages/Workouts/views/TemplatesView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Send,
  Users,
  Clock,
  Dumbbell
} from 'lucide-react';

const TemplatesView = () => {
  const navigate = useNavigate();

  // Mock data
  const templates = [
    {
      id: 1,
      name: 'Treino A - Peito e Tríceps',
      exercises: 8,
      duration: 60,
      assignedAthletes: 12,
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      name: 'Treino B - Costas e Bíceps',
      exercises: 7,
      duration: 55,
      assignedAthletes: 10,
      lastUpdated: '2025-01-14'
    },
    {
      id: 3,
      name: 'Treino C - Pernas Completo',
      exercises: 9,
      duration: 70,
      assignedAthletes: 8,
      lastUpdated: '2025-01-10'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Treino</h1>
          <p className="text-gray-600 mt-1">Gerir templates de treino para os seus atletas</p>
        </div>
        
        <button
          onClick={() => navigate('/workouts/builder')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Dumbbell size={14} /> Exercícios
                  </span>
                  <span className="font-medium">{template.exercises}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Duração
                  </span>
                  <span className="font-medium">{template.duration} min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> Atletas
                  </span>
                  <span className="font-medium">{template.assignedAthletes}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/workouts/builder/${template.id}`)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  <Edit size={14} className="inline mr-1" /> Editar
                </button>
                <button
                  onClick={() => navigate(`/workouts/assign/${template.id}`)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  <Send size={14} className="inline mr-1" /> Atribuir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesView;