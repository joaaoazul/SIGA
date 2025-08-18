// src/modules/trainer/pages/Workouts/components/WorkoutCard.js
import React from 'react';
import { 
  Dumbbell, 
  Clock, 
  Users, 
  Calendar,
  ChevronRight,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

const WorkoutCard = ({ 
  workout, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onView,
  showActions = true 
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{workout.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{workout.description}</p>
          </div>
          {workout.isFeatured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              Destaque
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Dumbbell size={14} /> Exercícios
            </span>
            <span className="font-medium">{workout.exerciseCount || 0}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock size={14} /> Duração
            </span>
            <span className="font-medium">{workout.duration || 60} min</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Users size={14} /> Atletas
            </span>
            <span className="font-medium">{workout.assignedAthletes || 0}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar size={14} /> Atualizado
            </span>
            <span className="font-medium">
              {new Date(workout.updatedAt || new Date()).toLocaleDateString('pt-PT')}
            </span>
          </div>
        </div>

        {workout.targetMuscles && workout.targetMuscles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {workout.targetMuscles.map(muscle => (
              <span 
                key={muscle} 
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => onView && onView(workout)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <ChevronRight size={14} /> Ver
            </button>
            <button
              onClick={() => onEdit && onEdit(workout)}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <Edit size={14} /> Editar
            </button>
            
            <div className="flex gap-1">
              <button
                onClick={() => onDuplicate && onDuplicate(workout)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Duplicar"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => onDelete && onDelete(workout)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;