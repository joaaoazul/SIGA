import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  Dumbbell, 
  Play,
  Edit2,
  Copy,
  Trash2,
  Filter,
  Search,
  Users,
  ChevronDown,
  Grid3x3,
  List,
  Folder,
  Star,
  Download,
  Share2,
  Activity,
  X,
  Check,
  AlertCircle,
  UserPlus,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { useAuth } from '../../../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const TemplatesView = ({ onStartWorkout, onNavigate, onSelectTemplate }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [assigningAthletes, setAssigningAthletes] = useState([]);
  const [planDetails, setPlanDetails] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    weeklyFrequency: 3
  });

  // Buscar templates do trainer
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // Buscar workout_plans do trainer com os templates
      const { data: plans, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          workout_templates (
            *,
            template_exercises (
              *,
              exercise:exercises (*),
              template_sets (*)
            )
          )
        `)
        .eq('trainer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar os dados para o formato do componente
      const formattedTemplates = [];
      plans?.forEach(plan => {
        plan.workout_templates?.forEach(template => {
          formattedTemplates.push({
            id: template.id,
            planId: plan.id,
            name: template.name,
            description: template.description,
            category: categorizeWorkout(template),
            duration: template.estimated_duration_minutes || 60,
            exercises: template.template_exercises || [],
            difficulty: calculateDifficulty(template),
            createdAt: template.created_at,
            updatedAt: template.updated_at,
            assignedAthletes: [],
            isFavorite: false
          });
        });
      });

      setTemplates(formattedTemplates);
      await fetchTemplateAssignments(formattedTemplates);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  // Buscar atletas do trainer
  const fetchAthletes = async () => {
    try {
      // Buscar atletas através dos invites aceites
      const { data: invites, error } = await supabase
        .from('invites')
        .select(`
          *,
          athlete:profiles!invites_accepted_by_fkey (
            id,
            email,
            name,
            avatar_url
          )
        `)
        .eq('trainer_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      const athletesList = invites?.map(invite => ({
        id: invite.athlete?.id || invite.accepted_by,
        name: invite.athlete?.name || invite.athlete_name,
        email: invite.athlete?.email || invite.athlete_email,
        avatar: invite.athlete?.avatar_url,
        joinedAt: invite.accepted_at
      })) || [];

      setAthletes(athletesList);
    } catch (error) {
      console.error('Erro ao buscar atletas:', error);
      toast.error('Erro ao carregar atletas');
    }
  };

  // Buscar atribuições de templates
  const fetchTemplateAssignments = async (templatesList) => {
    try {
      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select('workout_template_id, athlete_id')
        .in('workout_template_id', templatesList.map(t => t.id));

      if (error) throw error;

      // Atualizar templates com atletas atribuídos
      const updatedTemplates = templatesList.map(template => {
        const assignedAthletes = sessions
          ?.filter(s => s.workout_template_id === template.id)
          ?.map(s => s.athlete_id) || [];
        
        return {
          ...template,
          assignedAthletes: [...new Set(assignedAthletes)]
        };
      });

      setTemplates(updatedTemplates);
    } catch (error) {
      console.error('Erro ao buscar atribuições:', error);
    }
  };

  // Criar novo plano e atribuir a atletas
  const handleAssignTemplate = async () => {
    if (!selectedTemplate || assigningAthletes.length === 0) {
      toast.error('Selecione pelo menos um atleta');
      return;
    }

    try {
      setLoading(true);

      // Para cada atleta selecionado
      for (const athleteId of assigningAthletes) {
        // 1. Criar workout_plan para o atleta
        const { data: newPlan, error: planError } = await supabase
          .from('workout_plans')
          .insert({
            name: planDetails.name || selectedTemplate.name,
            description: planDetails.description || selectedTemplate.description,
            trainer_id: user.id,
            athlete_id: athleteId,
            start_date: planDetails.startDate,
            end_date: planDetails.endDate || null,
            status: 'active'
          })
          .select()
          .single();

        if (planError) throw planError;

        // 2. Copiar o template para o novo plano
        const { data: newTemplate, error: templateError } = await supabase
          .from('workout_templates')
          .insert({
            workout_plan_id: newPlan.id,
            name: selectedTemplate.name,
            description: selectedTemplate.description,
            estimated_duration_minutes: selectedTemplate.duration,
            order_in_plan: 1
          })
          .select()
          .single();

        if (templateError) throw templateError;

        // 3. Copiar exercícios e sets do template original
        if (selectedTemplate.exercises.length > 0) {
          for (const exercise of selectedTemplate.exercises) {
            const { data: newExercise, error: exerciseError } = await supabase
              .from('template_exercises')
              .insert({
                workout_template_id: newTemplate.id,
                exercise_id: exercise.exercise_id,
                order_in_workout: exercise.order_in_workout,
                rest_seconds: exercise.rest_seconds,
                notes: exercise.notes
              })
              .select()
              .single();

            if (exerciseError) throw exerciseError;

            // Copiar sets
            if (exercise.template_sets?.length > 0) {
              const sets = exercise.template_sets.map(set => ({
                template_exercise_id: newExercise.id,
                set_number: set.set_number,
                set_type: set.set_type,
                target_reps: set.target_reps,
                target_weight: set.target_weight,
                rpe_target: set.rpe_target
              }));

              const { error: setsError } = await supabase
                .from('template_sets')
                .insert(sets);

              if (setsError) throw setsError;
            }
          }
        }

        // 4. Criar sessões agendadas baseadas na frequência semanal
        await createScheduledSessions(newTemplate.id, athleteId, planDetails);
      }

      toast.success(`Template atribuído a ${assigningAthletes.length} atleta(s)`);
      setShowAssignModal(false);
      setAssigningAthletes([]);
      fetchTemplates(); // Recarregar templates
    } catch (error) {
      console.error('Erro ao atribuir template:', error);
      toast.error('Erro ao atribuir template');
    } finally {
      setLoading(false);
    }
  };

  // Criar sessões agendadas
  const createScheduledSessions = async (templateId, athleteId, details) => {
    const sessions = [];
    const startDate = new Date(details.startDate);
    const endDate = details.endDate ? new Date(details.endDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias por defeito
    
    let currentDate = new Date(startDate);
    let sessionCount = 0;

    while (currentDate <= endDate && sessionCount < details.weeklyFrequency * 4) { // Máximo 4 semanas
      sessions.push({
        workout_template_id: templateId,
        athlete_id: athleteId,
        scheduled_date: currentDate.toISOString().split('T')[0],
        status: 'scheduled'
      });

      // Avançar para o próximo dia de treino
      currentDate.setDate(currentDate.getDate() + Math.floor(7 / details.weeklyFrequency));
      sessionCount++;
    }

    if (sessions.length > 0) {
      const { error } = await supabase
        .from('workout_sessions')
        .insert(sessions);

      if (error) throw error;
    }
  };

  // Funções auxiliares
  const categorizeWorkout = (template) => {
    // Lógica para categorizar baseada nos exercícios
    return 'Geral';
  };

  const calculateDifficulty = (template) => {
    // Lógica para calcular dificuldade baseada nos sets/reps
    return 'Intermédio';
  };

  // Effects
  useEffect(() => {
    if (user) {
      fetchTemplates();
      fetchAthletes();
    }
  }, [user]);

  // Estatísticas
  const stats = {
    total: templates.length,
    activeToday: templates.filter(t => t.assignedAthletes.length > 0).length,
    totalAssigned: templates.reduce((acc, t) => acc + t.assignedAthletes.length, 0),
    favorites: templates.filter(t => t.isFavorite).length
  };

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && templates.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Templates de Treino</h1>
              <p className="text-sm text-gray-500 mt-1">Gerir e atribuir planos de treino</p>
            </div>
            <button
              onClick={() => onNavigate?.('create')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={Folder}
              label="Templates Totais"
              value={stats.total}
              bgColor="bg-gray-50"
              iconColor="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={Activity}
              label="Ativos Hoje"
              value={stats.activeToday}
              bgColor="bg-gray-50"
              iconColor="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Users}
              label="Atletas Atribuídos"
              value={stats.totalAssigned}
              bgColor="bg-gray-50"
              iconColor="bg-purple-100 text-purple-600"
            />
            <StatCard
              icon={Star}
              label="Favoritos"
              value={stats.favorites}
              bgColor="bg-gray-50"
              iconColor="bg-yellow-100 text-yellow-600"
            />
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''} rounded-l-lg transition-colors`}
              >
                <Grid3x3 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''} rounded-r-lg transition-colors`}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {filteredTemplates.length === 0 ? (
          <EmptyState onCreateNew={() => onNavigate?.('create')} />
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    athletes={athletes}
                    onStart={() => onStartWorkout?.(template)}
                    onEdit={() => onSelectTemplate?.(template)}
                    onAssign={() => {
                      setSelectedTemplate(template);
                      setShowAssignModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <TemplateListView
                templates={filteredTemplates}
                athletes={athletes}
                onStart={onStartWorkout}
                onEdit={onSelectTemplate}
                onAssign={(template) => {
                  setSelectedTemplate(template);
                  setShowAssignModal(true);
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal de Atribuição */}
      {showAssignModal && (
        <AssignTemplateModal
          template={selectedTemplate}
          athletes={athletes}
          assigningAthletes={assigningAthletes}
          setAssigningAthletes={setAssigningAthletes}
          planDetails={planDetails}
          setPlanDetails={setPlanDetails}
          onConfirm={handleAssignTemplate}
          onClose={() => {
            setShowAssignModal(false);
            setAssigningAthletes([]);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Componente de Card de Estatística
const StatCard = ({ icon: Icon, label, value, bgColor, iconColor }) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
      <p className="text-gray-600 mt-4">A carregar templates...</p>
    </div>
  </div>
);

// Template Card Component
const TemplateCard = ({ template, athletes, onStart, onEdit, onAssign }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const assignedAthletesCount = template.assignedAthletes?.length || 0;
  const exerciseCount = template.exercises?.length || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <TemplateMenu
                onClose={() => setShowMenu(false)}
                onEdit={onEdit}
                onAssign={onAssign}
                template={template}
              />
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Duração</span>
            <span className="font-medium text-gray-900">{template.duration} min</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Exercícios</span>
            <span className="font-medium text-gray-900">{exerciseCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Atletas</span>
            <span className="font-medium text-gray-900">{assignedAthletesCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onAssign}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Atribuir
          </button>
          <button
            onClick={onStart}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Template List View
const TemplateListView = ({ templates, athletes, onStart, onEdit, onAssign }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Template
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Categoria
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Exercícios
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Atletas
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {templates.map((template) => (
          <tr key={template.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div>
                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                {template.description && (
                  <div className="text-sm text-gray-500">{template.description}</div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {template.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {template.exercises?.length || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {template.assignedAthletes?.length || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAssign(template)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Atribuir
                </button>
                <button
                  onClick={() => onEdit(template)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Template Menu Dropdown
const TemplateMenu = ({ onClose, onEdit, onAssign, template }) => (
  <>
    <div className="fixed inset-0 z-10" onClick={onClose}></div>
    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
      <button 
        onClick={() => {
          onAssign();
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-sm"
      >
        <UserPlus className="w-4 h-4 text-gray-500" />
        <span>Atribuir a Atletas</span>
      </button>
      <button 
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-sm"
      >
        <Edit2 className="w-4 h-4 text-gray-500" />
        <span>Editar</span>
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-sm">
        <Copy className="w-4 h-4 text-gray-500" />
        <span>Duplicar</span>
      </button>
      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-sm">
        <Share2 className="w-4 h-4 text-gray-500" />
        <span>Partilhar</span>
      </button>
      <hr className="my-1" />
      <button className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors text-sm">
        <Trash2 className="w-4 h-4" />
        <span>Eliminar</span>
      </button>
    </div>
  </>
);

// Modal de Atribuição de Template
const AssignTemplateModal = ({ 
  template, 
  athletes, 
  assigningAthletes,
  setAssigningAthletes,
  planDetails,
  setPlanDetails,
  onConfirm, 
  onClose,
  loading 
}) => {
  const toggleAthlete = (athleteId) => {
    setAssigningAthletes(prev => 
      prev.includes(athleteId) 
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };

  const selectAll = () => {
    setAssigningAthletes(athletes.map(a => a.id));
  };

  const deselectAll = () => {
    setAssigningAthletes([]);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Atribuir Template</h2>
              <p className="text-sm text-gray-500 mt-1">{template.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Detalhes do Plano */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Detalhes do Plano</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={planDetails.name}
                  onChange={(e) => setPlanDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={template.name}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={planDetails.startDate}
                    onChange={(e) => setPlanDetails(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim (opcional)
                  </label>
                  <input
                    type="date"
                    value={planDetails.endDate}
                    onChange={(e) => setPlanDetails(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência Semanal
                </label>
                <select
                  value={planDetails.weeklyFrequency}
                  onChange={(e) => setPlanDetails(prev => ({ ...prev, weeklyFrequency: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1x por semana</option>
                  <option value={2}>2x por semana</option>
                  <option value={3}>3x por semana</option>
                  <option value={4}>4x por semana</option>
                  <option value={5}>5x por semana</option>
                  <option value={6}>6x por semana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seleção de Atletas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Selecionar Atletas ({assigningAthletes.length} selecionados)
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Selecionar todos
                </button>
                <button
                  onClick={deselectAll}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {athletes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Nenhum atleta disponível</p>
                </div>
              ) : (
                athletes.map((athlete) => (
                  <label
                    key={athlete.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={assigningAthletes.includes(athlete.id)}
                      onChange={() => toggleAthlete(athlete.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{athlete.name}</p>
                      <p className="text-xs text-gray-500">{athlete.email}</p>
                    </div>
                    {athlete.avatar && (
                      <img
                        src={athlete.avatar}
                        alt={athlete.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || assigningAthletes.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A atribuir...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar Atribuição
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State
const EmptyState = ({ onCreateNew }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Dumbbell className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Nenhum template encontrado
    </h3>
    <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
      Crie o seu primeiro template de treino para começar a planear os treinos dos seus atletas
    </p>
    <button
      onClick={onCreateNew}
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Plus className="w-4 h-4 mr-2" />
      Criar Template
    </button>
  </div>
);

export default TemplatesView;