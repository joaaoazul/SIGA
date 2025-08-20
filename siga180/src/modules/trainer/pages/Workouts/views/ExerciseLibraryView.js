// src/modules/trainer/pages/Workouts/views/ExerciseLibraryView.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Search, Filter, Video, Dumbbell, X, Eye, 
  Edit, Trash2, Star, Heart, Users, Clock, TrendingUp,
  Grid, List, ChevronDown, Activity, Repeat
} from 'lucide-react';

// Configuração Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ExerciseLibraryView = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchExercises();
    fetchFavorites();
  }, [selectedCategory, selectedMuscle]);

  const fetchExercises = async () => {
    try {
      let query = supabase
        .from('exercises')
        .select(`
          *,
          exercise_videos (
            id,
            video_url,
            thumbnail_url,
            angle,
            is_primary
          ),
          exercise_muscles (
            muscle_group
          )
        `)
        .order('name');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      if (selectedMuscle !== 'all') {
        query = query.eq('primary_muscle', selectedMuscle);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setExercises(data || []);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('exercise_favorites')
          .select('exercise_id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        setFavorites(data?.map(f => f.exercise_id) || []);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const toggleFavorite = async (exerciseId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (favorites.includes(exerciseId)) {
        await supabase
          .from('exercise_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('exercise_id', exerciseId);
        
        setFavorites(favorites.filter(id => id !== exerciseId));
      } else {
        await supabase
          .from('exercise_favorites')
          .insert({
            user_id: user.id,
            exercise_id: exerciseId
          });
        
        setFavorites([...favorites, exerciseId]);
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
    }
  };

  const deleteExercise = async (exerciseId) => {
    if (!window.confirm('Tem certeza que deseja excluir este exercício?')) return;
    
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);
      
      if (error) throw error;
      
      setExercises(exercises.filter(e => e.id !== exerciseId));
      alert('Exercício excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
      alert('Erro ao excluir exercício');
    }
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.primary_muscle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { value: 'all', label: 'Todas', icon: Grid },
    { value: 'strength', label: 'Força', icon: Dumbbell },
    { value: 'cardio', label: 'Cardio', icon: Activity },
    { value: 'flexibility', label: 'Flexibilidade', icon: Repeat },
    { value: 'balance', label: 'Equilíbrio', icon: Users }
  ];

  const muscleGroups = [
    { value: 'all', label: 'Todos' },
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'biceps', label: 'Bíceps' },
    { value: 'triceps', label: 'Tríceps' },
    { value: 'legs', label: 'Pernas' },
    { value: 'glutes', label: 'Glúteos' },
    { value: 'core', label: 'Core' },
    { value: 'full_body', label: 'Corpo Todo' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Exercícios</h1>
          <p className="text-gray-600 mt-1">
            {exercises.length} exercícios disponíveis
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Exercício
        </button>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Pesquisa */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar exercícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Grupo Muscular */}
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {muscleGroups.map(muscle => (
              <option key={muscle.value} value={muscle.value}>{muscle.label}</option>
            ))}
          </select>

          {/* Toggle View Mode */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Exercícios */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise}
              isFavorite={favorites.includes(exercise.id)}
              onToggleFavorite={() => toggleFavorite(exercise.id)}
              onClick={() => setSelectedExercise(exercise)}
              onDelete={() => deleteExercise(exercise.id)}
            />
          ))}
        </div>
      ) : (
        <ExerciseListView 
          exercises={filteredExercises}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onView={setSelectedExercise}
          onDelete={deleteExercise}
        />
      )}

      {/* Modal de Detalhes */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onEdit={() => {
            // Implementar edição
            console.log('Editar exercício:', selectedExercise.id);
          }}
        />
      )}

      {/* Modal de Adicionar */}
      {showAddModal && (
        <AddExerciseModal
          onClose={() => setShowAddModal(false)}
          onSave={(newExercise) => {
            setExercises([...exercises, newExercise]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Componente Card de Exercício
const ExerciseCard = ({ exercise, isFavorite, onToggleFavorite, onClick, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      {/* Imagem/Vídeo Preview */}
      <div 
        className="aspect-video bg-gray-200 relative cursor-pointer"
        onClick={onClick}
      >
        {exercise.exercise_videos?.[0] ? (
          <>
            <img 
              src={exercise.exercise_videos[0].thumbnail_url} 
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Video className="w-3 h-3" />
              {exercise.exercise_videos.length}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 left-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{exercise.name}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            {exercise.primary_muscle}
          </span>
          {exercise.equipment && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {exercise.equipment}
            </span>
          )}
          {exercise.difficulty && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
              {exercise.difficulty}
            </span>
          )}
        </div>
        
        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={onClick}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
          >
            Ver Detalhes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Vista em Lista
const ExerciseListView = ({ exercises, favorites, onToggleFavorite, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exercício
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Músculo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vídeos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {exercises.map(exercise => (
            <tr key={exercise.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleFavorite(exercise.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(exercise.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </button>
                  <span className="font-medium text-gray-900">{exercise.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {exercise.primary_muscle}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {exercise.equipment || 'Nenhum'}
              </td>
              <td className="px-6 py-4">
                {exercise.exercise_videos?.length > 0 && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Video className="w-4 h-4" />
                    {exercise.exercise_videos.length}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(exercise)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(exercise.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Modal de Detalhes
const ExerciseDetailModal = ({ exercise, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {exercise.primary_muscle}
                </span>
                {exercise.equipment && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {exercise.equipment}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Vídeos */}
          {exercise.exercise_videos && exercise.exercise_videos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vídeos Demonstrativos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.exercise_videos.map(video => (
                  <div key={video.id} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <video controls className="w-full h-full object-cover">
                      <source src={video.video_url} type="video/mp4" />
                    </video>
                    <p className="text-sm text-gray-600 mt-2">Ângulo: {video.angle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Músculos Trabalhados</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Principal:</span>
                  <p className="font-medium">{exercise.primary_muscle}</p>
                </div>
                {exercise.secondary_muscles && (
                  <div>
                    <span className="text-sm text-gray-600">Secundários:</span>
                    <p className="font-medium">{exercise.secondary_muscles}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Categoria:</dt>
                  <dd className="font-medium">{exercise.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Equipamento:</dt>
                  <dd className="font-medium">{exercise.equipment || 'Nenhum'}</dd>
                </div>
                {exercise.difficulty && (
                  <div>
                    <dt className="text-sm text-gray-600">Dificuldade:</dt>
                    <dd className="font-medium">{exercise.difficulty}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Instruções */}
          {exercise.instructions && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instruções de Execução</h3>
              <p className="text-gray-600 whitespace-pre-line">{exercise.instructions}</p>
            </div>
          )}
          
          {/* Dicas */}
          {exercise.tips && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dicas</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {exercise.tips.split('\n').map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Adicionar Exercício (simplificado)
const AddExerciseModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'strength',
    primary_muscle: 'chest',
    equipment: '',
    instructions: '',
    tips: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([formData])
        .select()
        .single();
      
      if (error) throw error;
      
      onSave(data);
      alert('Exercício adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      alert('Erro ao adicionar exercício');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Novo Exercício</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Exercício *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="strength">Força</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibilidade</option>
                <option value="balance">Equilíbrio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Músculo Principal
              </label>
              <select
                value={formData.primary_muscle}
                onChange={(e) => setFormData({...formData, primary_muscle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="chest">Peito</option>
                <option value="back">Costas</option>
                <option value="shoulders">Ombros</option>
                <option value="biceps">Bíceps</option>
                <option value="triceps">Tríceps</option>
                <option value="legs">Pernas</option>
                <option value="core">Core</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipamento
            </label>
            <input
              type="text"
              value={formData.equipment}
              onChange={(e) => setFormData({...formData, equipment: e.target.value})}
              placeholder="Ex: Barra, Halteres, Máquina..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruções
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar Exercício
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseLibraryView;