// src/modules/trainer/pages/Workouts/components/templates/TemplateCard.js

import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit2, 
  Copy, 
  Trash2, 
  Play,
  Clock,
  Dumbbell,
  TrendingUp
} from 'lucide-react';

/**
 * Card de Template de Treino
 * 
 * Mostra as informações do template e permite ações rápidas
 * Suporta dois modos de visualização: grid e list
 */
const TemplateCard = ({ 
  template, 
  viewMode = 'grid',
  onStart, 
  onEdit, 
  onDuplicate, 
  onDelete 
}) => {
  // Estado para mostrar/esconder menu de opções
  const [showMenu, setShowMenu] = useState(false);

  /**
   * Formata a data para exibição
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca usado';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    
    return date.toLocaleDateString('pt-PT');
  };

  /**
   * Obtém a primeira linha de exercícios para preview
   */
  const getExercisePreview = () => {
    const maxToShow = 3;
    const exercises = template.exercises.slice(0, maxToShow);
    const remaining = template.exercises.length - maxToShow;
    
    let preview = exercises.map(ex => ex.name.split('(')[0].trim()).join(', ');
    if (remaining > 0) {
      preview += ` +${remaining} mais`;
    }
    
    return preview;
  };

  /**
   * Renderização para modo Grid
   */
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 relative">
        {/* Menu de Opções */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  onDuplicate();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicar
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo do Card */}
        <div className="pr-8">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {template.name}
          </h3>
          
          {/* Preview dos exercícios */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {getExercisePreview()}
          </p>
          
          {/* Estatísticas */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              <span>{template.exercises.length} exercícios</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{template.estimatedDuration || 45} min</span>
            </div>
          </div>
          
          {/* Última utilização */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">
              {formatDate(template.lastUsed)}
            </span>
            {template.timesUsed > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {template.timesUsed}x usado
              </span>
            )}
          </div>
          
          {/* Botão de Iniciar */}
          <button
            onClick={onStart}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Iniciar Treino
          </button>
        </div>
      </div>
    );
  }

  /**
   * Renderização para modo Lista (mais compacto)
   */
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {template.exercises.length} exercícios
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{getExercisePreview()}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onStart}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;