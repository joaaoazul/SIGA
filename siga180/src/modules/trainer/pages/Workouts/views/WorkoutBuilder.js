import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Search,
  Clock,
  Dumbbell,
  X,
  Copy,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Repeat,
  Target,
  Info,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { useAuth } from '../../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const WorkoutBuilder = ({ mode = 'create', template, onSave, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saving, setSaving] = useState(false);

  // Categorias de exercícios
  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'arms', label: 'Braços' },
    { value: 'legs', label: 'Pernas' },
    { value: 'core', label: 'Core' },
    { value: 'cardio', label: 'Cardio' }
  ];

  // Carregar dados do template se estiver em modo de edição
  useEffect(() => {
    if (mode === 'edit' && template) {
      setWorkoutName(template.name || '');
      setDescription(template.description || '');
      setEstimatedDuration(template.duration || 60);
      
      // Converter exercícios do template para o formato do builder
      const formattedExercises = template.exercises?.map((ex, index) => ({
        id: ex.id || `temp-${Date.now()}-${index}`,
        exercise_id: ex.exercise_id,
        name: ex.exercise?.name || ex.name,
        category: ex.exercise?.category || ex.category,
        order: index + 1,
        sets: ex.template_sets?.map(set => ({
          id: set.id || `set-${Date.now()}-${Math.random()}`,
          type: set.set_type || 'working',
          reps: set.target_reps,
          weight: set.target_weight,
          rest: ex.rest_seconds || 60,
          rpe: set.rpe_target
        })) || [createNewSet()]
      })) || [];
      
      setExercises(formattedExercises);
    }
  }, [mode, template]);

  // Buscar exercícios disponíveis
  useEffect(() => {
    fetchAvailableExercises();
  }, []);

  const fetchAvailableExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('is_public', true)
        .order('name');

      if (error) throw error;
      setAvailableExercises(data || []);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      // Usar dados mock se falhar
      setAvailableExercises(mockExercises);
    }
  };

  // Mock exercises para desenvolvimento
  const mockExercises = [
    { id: '1', name: 'Supino Reto', category: 'chest', primary_muscle: 'Peitoral' },
    { id: '2', name: 'Supino Inclinado', category: 'chest', primary_muscle: 'Peitoral Superior' },
    { id: '3', name: 'Agachamento Livre', category: 'legs', primary_muscle: 'Quadríceps' },
    { id: '4', name: 'Levantamento Terra', category: 'back', primary_muscle: 'Posterior' },
    { id: '5', name: 'Desenvolvimento Militar', category: 'shoulders', primary_muscle: 'Deltoides' },
    { id: '6', name: 'Remada Curvada', category: 'back', primary_muscle: 'Dorsais' },
    { id: '7', name: 'Rosca Direta', category: 'arms', primary_muscle: 'Bíceps' },
    { id: '8', name: 'Tríceps Pulley', category: 'arms', primary_muscle: 'Tríceps' },
    { id: '9', name: 'Leg Press', category: 'legs', primary_muscle: 'Quadríceps' },
    { id: '10', name: 'Prancha', category: 'core', primary_muscle: 'Core' }
  ];

  // Criar novo set
  const createNewSet = () => ({
    id: `set-${Date.now()}-${Math.random()}`,
    type: 'working',
    reps: 10,
    weight: null,
    rest: 60,
    rpe: null
  });

  // Adicionar exercício
  const addExercise = (exercise) => {
    const newExercise = {
      id: `temp-${Date.now()}`,
      exercise_id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      primary_muscle: exercise.primary_muscle,
      order: exercises.length + 1,
      sets: [createNewSet()]
    };
    
    setExercises([...exercises, newExercise]);
    setShowExerciseSearch(false);
    setSearchTerm('');
  };

  // Remover exercício
  const removeExercise = (exerciseId) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  // Duplicar exercício
  const duplicateExercise = (exercise) => {
    const duplicated = {
      ...exercise,
      id: `temp-${Date.now()}`,
      order: exercises.length + 1
    };
    setExercises([...exercises, duplicated]);
  };

  // Adicionar set a um exercício
  const addSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, createNewSet()]
        };
      }
      return ex;
    }));
  };

  // Remover set
  const removeSet = (exerciseId, setIndex) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter((_, index) => index !== setIndex)
        };
      }
      return ex;
    }));
  };

  // Atualizar set
  const updateSet = (exerciseId, setIndex, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const updatedSets = [...ex.sets];
        updatedSets[setIndex] = {
          ...updatedSets[setIndex],
          [field]: value
        };
        return { ...ex, sets: updatedSets };
      }
      return ex;
    }));
  };

  // Guardar template
  const handleSave = async () => {
    if (!workoutName.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    setSaving(true);
    
    try {
      const templateData = {
        name: workoutName,
        description,
        estimated_duration_minutes: estimatedDuration,
        exercises: exercises.map((ex, index) => ({
          exercise_id: ex.exercise_id,
          order_in_workout: index + 1,
          rest_seconds: ex.sets[0]?.rest || 60,
          sets: ex.sets.map((set, setIndex) => ({
            set_number: setIndex + 1,
            set_type: set.type,
            target_reps: set.reps,
            target_weight: set.weight,
            rpe_target: set.rpe
          }))
        }))
      };

      if (onSave) {
        await onSave(templateData);
      }

      toast.success(mode === 'edit' ? 'Template atualizado!' : 'Template criado!');
    } catch (error) {
      console.error('Erro ao guardar template:', error);
      toast.error('Erro ao guardar template');
    } finally {
      setSaving(false);
    }
  };

  // Filtrar exercícios
  const filteredExercises = availableExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    navigate(-1); // Volta para a página anterior
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {mode === 'edit' ? 'Editar Template' : 'Criar Template'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Construa um plano de treino personalizado
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Template *
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Ex: Push/Pull/Legs - Dia A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração Estimada (minutos)
              </label>
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
                min="15"
                max="180"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo deste template..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Lista de Exercícios */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Exercícios ({exercises.length})
            </h2>
            <button
              onClick={() => setShowExerciseSearch(true)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </button>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">Nenhum exercício adicionado</p>
              <button
                onClick={() => setShowExerciseSearch(true)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Adicionar primeiro exercício
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise, exerciseIndex) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                  onRemove={() => removeExercise(exercise.id)}
                  onDuplicate={() => duplicateExercise(exercise)}
                  onAddSet={() => addSet(exercise.id)}
                  onRemoveSet={(setIndex) => removeSet(exercise.id, setIndex)}
                  onUpdateSet={(setIndex, field, value) => updateSet(exercise.id, setIndex, field, value)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pesquisa de Exercícios */}
      {showExerciseSearch && (
        <ExerciseSearchModal
          exercises={filteredExercises}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          onSelectExercise={addExercise}
          onClose={() => {
            setShowExerciseSearch(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

// Componente de Card de Exercício
const ExerciseCard = ({ 
  exercise, 
  exerciseIndex, 
  onRemove, 
  onDuplicate, 
  onAddSet, 
  onRemoveSet, 
  onUpdateSet 
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header do Exercício */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
          <div>
            <h3 className="font-medium text-gray-900">
              {exerciseIndex + 1}. {exercise.name}
            </h3>
            <p className="text-xs text-gray-500">
              {exercise.primary_muscle} • {exercise.sets.length} sets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Sets do Exercício */}
      {expanded && (
        <div className="p-4">
          {/* Headers da tabela */}
          <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500">
            <div className="col-span-2">Set</div>
            <div className="col-span-2">Tipo</div>
            <div className="col-span-2">Reps</div>
            <div className="col-span-2">Peso (kg)</div>
            <div className="col-span-2">Descanso</div>
            <div className="col-span-1">RPE</div>
            <div className="col-span-1"></div>
          </div>

          {/* Sets */}
          {exercise.sets.map((set, setIndex) => (
            <div key={set.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-2">
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-center">
                  {setIndex + 1}
                </div>
              </div>
              <div className="col-span-2">
                <select
                  value={set.type}
                  onChange={(e) => onUpdateSet(setIndex, 'type', e.target.value)}
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="warmup">Aquec.</option>
                  <option value="working">Normal</option>
                  <option value="drop">Drop</option>
                  <option value="failure">Falha</option>
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => onUpdateSet(setIndex, 'reps', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={set.weight || ''}
                  onChange={(e) => onUpdateSet(setIndex, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="--"
                  step="0.5"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={set.rest}
                  onChange={(e) => onUpdateSet(setIndex, 'rest', parseInt(e.target.value))}
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value={30}>30s</option>
                  <option value={45}>45s</option>
                  <option value={60}>1min</option>
                  <option value={90}>1:30</option>
                  <option value={120}>2min</option>
                  <option value={180}>3min</option>
                  <option value={240}>4min</option>
                  <option value={300}>5min</option>
                </select>
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  value={set.rpe || ''}
                  onChange={(e) => onUpdateSet(setIndex, 'rpe', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="--"
                  min="1"
                  max="10"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm text-center"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => onRemoveSet(setIndex)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  disabled={exercise.sets.length === 1}
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}

          {/* Botão Adicionar Set */}
          <button
            onClick={onAddSet}
            className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg text-sm text-gray-600 hover:text-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Adicionar Set
          </button>
        </div>
      )}
    </div>
  );
};

// Modal de Pesquisa de Exercícios
const ExerciseSearchModal = ({ 
  exercises, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  onSelectExercise, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Adicionar Exercício</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar exercício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercise List */}
        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {exercises.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum exercício encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => onSelectExercise(exercise)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {exercise.primary_muscle} • {exercise.category}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;