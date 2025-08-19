// src/modules/trainer/pages/Workouts/views/AssignView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Send, 
  Calendar,
  Users,
  Clock,
  ChevronLeft,
  Search,
  Check,
  X,
  AlertCircle,
  Dumbbell,
  UserPlus,
  Copy,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AssignView = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [assignmentSettings, setAssignmentSettings] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    frequency: 'weekly',
    daysOfWeek: [],
    customizePerAthlete: false,
    sendNotification: true,
    includeInstructions: true
  });
  
  const [templates, setTemplates] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    // Mock templates
    setTemplates([
      {
        id: 1,
        name: 'Treino A - Peito e Tríceps',
        duration: 60,
        exercises: 8,
        difficulty: 'intermediate'
      },
      {
        id: 2,
        name: 'Treino B - Costas e Bíceps',
        duration: 55,
        exercises: 7,
        difficulty: 'intermediate'
      },
      {
        id: 3,
        name: 'Treino C - Pernas',
        duration: 70,
        exercises: 9,
        difficulty: 'advanced'
      }
    ]);

    // Mock athletes
    setAthletes([
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        goal: 'Hipertrofia',
        level: 'intermediate',
        avatar: null,
        lastWorkout: '2 dias atrás',
        currentPlan: 'Nenhum'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@example.com',
        goal: 'Emagrecimento',
        level: 'beginner',
        avatar: null,
        lastWorkout: 'Hoje',
        currentPlan: 'Full Body'
      },
      {
        id: 3,
        name: 'Pedro Costa',
        email: 'pedro@example.com',
        goal: 'Força',
        level: 'advanced',
        avatar: null,
        lastWorkout: 'Ontem',
        currentPlan: 'PowerLifting'
      },
      {
        id: 4,
        name: 'Ana Rodrigues',
        email: 'ana@example.com',
        goal: 'Condicionamento',
        level: 'intermediate',
        avatar: null,
        lastWorkout: '3 dias atrás',
        currentPlan: 'HIIT'
      },
      {
        id: 5,
        name: 'Carlos Mendes',
        email: 'carlos@example.com',
        goal: 'Hipertrofia',
        level: 'intermediate',
        avatar: null,
        lastWorkout: 'Há 1 semana',
        currentPlan: 'Nenhum'
      }
    ]);

    // Se veio com templateId, pré-selecionar
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        setSelectedTemplate(template);
        setStep(2);
      }
    }
  }, [templateId]);

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAthlete = (athleteId) => {
    setSelectedAthletes(prev =>
      prev.includes(athleteId)
        ? prev.filter(id => id !== athleteId)
        : [...prev, athleteId]
    );
  };

  const toggleAllAthletes = () => {
    if (selectedAthletes.length === filteredAthletes.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(filteredAthletes.map(a => a.id));
    }
  };

  const toggleDayOfWeek = (day) => {
    setAssignmentSettings(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleAssign = async () => {
    setLoading(true);
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Treino atribuído a ${selectedAthletes.length} atleta(s) com sucesso!`);
      navigate('/workouts/templates');
    } catch (error) {
      toast.error('Erro ao atribuir treino. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedTemplate !== null;
    if (step === 2) return selectedAthletes.length > 0;
    if (step === 3) {
      return assignmentSettings.startDate && 
             (assignmentSettings.frequency !== 'weekly' || assignmentSettings.daysOfWeek.length > 0);
    }
    return false;
  };

  const weekDays = [
    { value: 1, label: 'Seg', short: 'S' },
    { value: 2, label: 'Ter', short: 'T' },
    { value: 3, label: 'Qua', short: 'Q' },
    { value: 4, label: 'Qui', short: 'Q' },
    { value: 5, label: 'Sex', short: 'S' },
    { value: 6, label: 'Sáb', short: 'S' },
    { value: 0, label: 'Dom', short: 'D' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/workouts/templates')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft size={20} />
          Voltar aos Templates
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Atribuir Treino</h1>
        <p className="text-gray-600 mt-1">
          Selecione o template, atletas e configure o agendamento
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Template' },
            { num: 2, label: 'Atletas' },
            { num: 3, label: 'Configurações' },
            { num: 4, label: 'Confirmar' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div 
                className={`flex items-center gap-3 cursor-pointer ${
                  step >= s.num ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => step > s.num && setStep(s.num)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step > s.num ? 'bg-green-500 text-white' :
                  step === s.num ? 'bg-blue-600 text-white' :
                  'bg-gray-200'
                }`}>
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <span className="hidden md:block font-medium">{s.label}</span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-1 mx-3 ${
                  step > s.num ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Step 1: Select Template */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selecione o Template de Treino
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Dumbbell size={14} />
                          {template.exercises} exercícios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {template.duration} min
                        </span>
                      </div>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Athletes */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Selecione os Atletas ({selectedAthletes.length} selecionado{selectedAthletes.length !== 1 ? 's' : ''})
              </h2>
              <button
                onClick={toggleAllAthletes}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedAthletes.length === filteredAthletes.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar atletas..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredAthletes.map(athlete => (
                <div
                  key={athlete.id}
                  onClick={() => toggleAthlete(athlete.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAthletes.includes(athlete.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{athlete.name}</p>
                        <p className="text-sm text-gray-600">{athlete.goal} • {athlete.level}</p>
                        {athlete.currentPlan !== 'Nenhum' && (
                          <p className="text-xs text-orange-600 mt-1">
                            <AlertCircle size={12} className="inline mr-1" />
                            Plano atual: {athlete.currentPlan}
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedAthletes.includes(athlete.id) && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Configurações do Treino
            </h2>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={assignmentSettings.startDate}
                  onChange={(e) => setAssignmentSettings(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Fim (Opcional)
                </label>
                <input
                  type="date"
                  value={assignmentSettings.endDate}
                  onChange={(e) => setAssignmentSettings(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'daily', label: 'Diário' },
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'custom', label: 'Personalizado' }
                ].map(freq => (
                  <button
                    key={freq.value}
                    onClick={() => setAssignmentSettings(prev => ({ ...prev, frequency: freq.value }))}
                    className={`p-3 border-2 rounded-lg font-medium transition-all ${
                      assignmentSettings.frequency === freq.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days of Week */}
            {assignmentSettings.frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias da Semana
                </label>
                <div className="flex gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day.value}
                      onClick={() => toggleDayOfWeek(day.value)}
                      className={`w-12 h-12 rounded-lg font-medium transition-all ${
                        assignmentSettings.daysOfWeek.includes(day.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignmentSettings.sendNotification}
                  onChange={(e) => setAssignmentSettings(prev => ({ ...prev, sendNotification: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Enviar notificação aos atletas</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignmentSettings.includeInstructions}
                  onChange={(e) => setAssignmentSettings(prev => ({ ...prev, includeInstructions: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Incluir instruções detalhadas</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignmentSettings.customizePerAthlete}
                  onChange={(e) => setAssignmentSettings(prev => ({ ...prev, customizePerAthlete: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Personalizar por atleta</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Atribuição
            </h2>

            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Resumo</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium">{selectedTemplate?.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Atletas:</span>
                    <span className="font-medium">{selectedAthletes.length} selecionados</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Início:</span>
                    <span className="font-medium">
                      {new Date(assignmentSettings.startDate).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  
                  {assignmentSettings.endDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fim:</span>
                      <span className="font-medium">
                        {new Date(assignmentSettings.endDate).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frequência:</span>
                    <span className="font-medium">
                      {assignmentSettings.frequency === 'daily' ? 'Diário' :
                       assignmentSettings.frequency === 'weekly' ? 'Semanal' :
                       'Personalizado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Athletes List */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Atletas Selecionados</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {athletes
                    .filter(a => selectedAthletes.includes(a.id))
                    .map(athlete => (
                      <div key={athlete.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {athlete.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{athlete.name}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Warning */}
              {athletes.filter(a => selectedAthletes.includes(a.id) && a.currentPlan !== 'Nenhum').length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Alguns atletas já têm planos ativos
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Os planos atuais serão substituídos pelo novo treino.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/workouts/templates')}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {step === 1 ? 'Cancelar' : 'Voltar'}
        </button>
        
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Atribuindo...
              </>
            ) : (
              <>
                <Send size={18} />
                Atribuir Treino
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignView;