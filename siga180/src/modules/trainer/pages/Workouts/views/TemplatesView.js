// src/modules/trainer/pages/Workouts/views/TemplatesView.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Dumbbell,
  ArrowRight,
  Grid,
  List,
  Star,
  RefreshCw,
  Upload,
  Copy,
  Trash2,
  Edit,
  Send,
  Eye,
  MoreVertical
} from 'lucide-react';
import WorkoutCard from '../components/WorkoutCard';
import workoutService from '../services/workoutService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';

const TemplatesView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar templates do Supabase
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const result = await workoutService.getTemplates(user?.id);
      
      if (result.success && result.data) {
        // Formatar dados para o componente
        const formattedTemplates = result.data.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          exerciseCount: template.exercises?.length || 0,
          duration: template.estimatedDuration || 60,
          assignedAthletes: 0, // TODO: Buscar contagem real
          targetMuscles: extractMuscles(template.exercises),
          difficulty: determineDifficulty(template.exercises),
          isFeatured: false, // TODO: Adicionar campo na BD
          updatedAt: template.updatedAt || template.createdAt,
          createdAt: template.createdAt,
          exercises: template.exercises
        }));
        
        setTemplates(formattedTemplates);
      } else {
        toast.error('Erro ao carregar templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Extrair músculos únicos dos exercícios
  const extractMuscles = (exercises) => {
    if (!exercises) return [];
    const muscles = new Set();
    exercises.forEach(ex => {
      if (ex.primaryMuscle) muscles.add(ex.primaryMuscle);
      if (ex.secondaryMuscles) {
        ex.secondaryMuscles.forEach(m => muscles.add(m));
      }
    });
    return Array.from(muscles).slice(0, 4); // Máximo 4 para não poluir UI
  };

  // Determinar dificuldade baseado nos exercícios
  const determineDifficulty = (exercises) => {
    if (!exercises || exercises.length === 0) return 'beginner';
    
    const avgSets = exercises.reduce((acc, ex) => {
      return acc + (ex.sets?.length || 3);
    }, 0) / exercises.length;
    
    if (avgSets > 4 || exercises.length > 8) return 'advanced';
    if (avgSets > 3 || exercises.length > 5) return 'intermediate';
    return 'beginner';
  };

  // Carregar templates ao montar
  useEffect(() => {
    fetchTemplates();
  }, [user]);

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'featured' && template.isFeatured) ||
                          (filterType === 'beginner' && template.difficulty === 'beginner') ||
                          (filterType === 'intermediate' && template.difficulty === 'intermediate') ||
                          (filterType === 'advanced' && template.difficulty === 'advanced');
    
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleDuplicate = async (workout) => {
    try {
      const newName = prompt('Nome do novo template:', `${workout.name} (Cópia)`);
      if (!newName) return;
      
      const result = await workoutService.duplicateTemplate(workout.id, newName);
      
      if (result.success) {
        toast.success('Template duplicado com sucesso!');
        fetchTemplates(); // Recarregar lista
      } else {
        toast.error('Erro ao duplicar template');
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Erro ao duplicar template');
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      const result = await workoutService.deleteTemplate(templateToDelete.id);
      
      if (result.success) {
        toast.success('Template eliminado com sucesso!');
        setTemplates(templates.filter(t => t.id !== templateToDelete.id));
        setShowDeleteModal(false);
        setTemplateToDelete(null);
      } else {
        toast.error('Erro ao eliminar template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erro ao eliminar template');
    }
  };

  const confirmDelete = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(filteredTemplates, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `templates_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Templates exportados com sucesso!');
    } catch (error) {
      console.error('Error exporting templates:', error);
      toast.error('Erro ao exportar templates');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const importedTemplates = JSON.parse(text);
      
      // TODO: Validar e importar templates para a BD
      toast.success(`${importedTemplates.length} templates importados!`);
      fetchTemplates();
    } catch (error) {
      console.error('Error importing templates:', error);
      toast.error('Erro ao importar templates');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTemplates();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Treino</h1>
          <p className="text-gray-600 mt-1">
            {templates.length} template{templates.length !== 1 ? 's' : ''} disponíve{templates.length !== 1 ? 'is' : 'l'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Atualizar"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Exportar"
          >
            <Download size={20} />
          </button>
          
          <label className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <Upload size={20} />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => navigate('/workouts/builder')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Template
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar templates..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({templates.length})
            </button>
            <button
              onClick={() => setFilterType('beginner')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'beginner' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Iniciante
            </button>
            <button
              onClick={() => setFilterType('intermediate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'intermediate' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Intermediário
            </button>
            <button
              onClick={() => setFilterType('advanced')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'advanced' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Avançado
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              title="Vista em grelha"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              title="Vista em lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <WorkoutCard
              key={template.id}
              workout={template}
              onEdit={(w) => navigate(`/workouts/builder/${w.id}`)}
              onView={(w) => navigate(`/workouts/session/${w.id}`)}
              onDuplicate={handleDuplicate}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {template.isFeatured && (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {template.difficulty === 'beginner' ? 'Iniciante' :
                       template.difficulty === 'intermediate' ? 'Intermediário' :
                       'Avançado'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{template.exerciseCount} exercícios</span>
                    <span>{template.duration} min</span>
                    <span>{template.assignedAthletes} atletas</span>
                    <span>Atualizado: {new Date(template.updatedAt).toLocaleDateString('pt-PT')}</span>
                  </div>
                  
                  {template.targetMuscles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.targetMuscles.map(muscle => (
                        <span key={muscle} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/workouts/session/${template.id}`)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye size={16} /> Ver
                  </button>
                  <button
                    onClick={() => navigate(`/workouts/builder/${template.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={() => navigate(`/workouts/assign/${template.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Send size={16} /> Atribuir
                  </button>
                  
                  <div className="relative group">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy size={14} /> Duplicar
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => confirmDelete(template)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Dumbbell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' 
              ? 'Nenhum template encontrado' 
              : 'Ainda não tem templates'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all'
              ? 'Tente ajustar os filtros ou termos de pesquisa'
              : 'Crie o seu primeiro template de treino'}
          </p>
          {(!searchTerm && filterType === 'all') && (
            <button
              onClick={() => navigate('/workouts/builder')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Criar Primeiro Template
            </button>
          )}
        </div>
      )}

      {/* Stats Footer */}
      {filteredTemplates.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTemplates.length}
              </p>
              <p className="text-sm text-gray-600">Templates</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTemplates.reduce((sum, t) => sum + t.exerciseCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Exercícios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredTemplates.reduce((sum, t) => sum + t.duration, 0) / filteredTemplates.length)}
              </p>
              <p className="text-sm text-gray-600">Min Médio</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTemplates.reduce((sum, t) => sum + t.assignedAthletes, 0)}
              </p>
              <p className="text-sm text-gray-600">Atletas Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Eliminação
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja eliminar o template "{templateToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;