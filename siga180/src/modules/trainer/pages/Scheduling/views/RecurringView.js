import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Copy,
  Pause,
  Play,
  X,
  Settings,
  CalendarDays
} from 'lucide-react';

const RecurringView = () => {
  const [recurringSchedules, setRecurringSchedules] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(false);

  // Mock data para demonstração
  useEffect(() => {
    setRecurringSchedules([
      {
        id: 1,
        title: 'Treino de Força',
        athlete: { name: 'João Silva', avatar: null },
        pattern: 'weekly',
        frequency: { days: ['MON', 'WED', 'FRI'], time: '08:00' },
        duration: 60,
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        status: 'active',
        nextOccurrence: '2025-01-22',
        totalOccurrences: 36,
        completedOccurrences: 12
      },
      {
        id: 2,
        title: 'Cardio HIIT',
        athlete: { name: 'Maria Santos', avatar: null },
        pattern: 'biweekly',
        frequency: { days: ['TUE', 'THU'], time: '18:00' },
        duration: 45,
        startDate: '2025-01-15',
        endDate: null,
        status: 'active',
        nextOccurrence: '2025-01-23',
        totalOccurrences: null,
        completedOccurrences: 4
      },
      {
        id: 3,
        title: 'Avaliação Física',
        athlete: { name: 'Pedro Costa', avatar: null },
        pattern: 'monthly',
        frequency: { dayOfMonth: 1, time: '10:00' },
        duration: 90,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'paused',
        nextOccurrence: null,
        totalOccurrences: 12,
        completedOccurrences: 0
      }
    ]);
  }, []);

  const PatternBadge = ({ pattern }) => {
    const patterns = {
      daily: { label: 'Diário', color: 'purple' },
      weekly: { label: 'Semanal', color: 'blue' },
      biweekly: { label: 'Quinzenal', color: 'green' },
      monthly: { label: 'Mensal', color: 'orange' }
    };
    
    const config = patterns[pattern] || { label: pattern, color: 'gray' };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${config.color}-100 text-${config.color}-700`}>
        {config.label}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const config = {
      active: { icon: Play, color: 'green', label: 'Ativo' },
      paused: { icon: Pause, color: 'yellow', label: 'Pausado' },
      ended: { icon: CheckCircle, color: 'gray', label: 'Finalizado' }
    };
    
    const { icon: Icon, color, label } = config[status] || config.ended;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
        <Icon size={12} />
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  };

  const CreateRecurringModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      athleteId: '',
      pattern: 'weekly',
      startDate: '',
      endDate: '',
      time: '',
      duration: 60,
      selectedDays: [],
      dayOfMonth: 1,
      weekOfMonth: 1,
      location: '',
      isOnline: false,
      notes: ''
    });

    const weekDays = [
      { value: 'MON', label: 'Seg' },
      { value: 'TUE', label: 'Ter' },
      { value: 'WED', label: 'Qua' },
      { value: 'THU', label: 'Qui' },
      { value: 'FRI', label: 'Sex' },
      { value: 'SAT', label: 'Sáb' },
      { value: 'SUN', label: 'Dom' }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Criar Agendamento Recorrente</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Informações Básicas</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Agendamento
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Treino de Força"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Atleta
                </label>
                <select
                  value={formData.athleteId}
                  onChange={(e) => setFormData({...formData, athleteId: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um atleta</option>
                  <option value="1">João Silva</option>
                  <option value="2">Maria Santos</option>
                  <option value="3">Pedro Costa</option>
                </select>
              </div>
            </div>

            {/* Padrão de Recorrência */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Padrão de Recorrência</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['daily', 'weekly', 'biweekly', 'monthly'].map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setFormData({...formData, pattern})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.pattern === pattern
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <PatternBadge pattern={pattern} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de dias para padrão semanal */}
              {(formData.pattern === 'weekly' || formData.pattern === 'biweekly') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias da Semana
                  </label>
                  <div className="flex gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          const days = formData.selectedDays.includes(day.value)
                            ? formData.selectedDays.filter(d => d !== day.value)
                            : [...formData.selectedDays, day.value];
                          setFormData({...formData, selectedDays: days});
                        }}
                        className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                          formData.selectedDays.includes(day.value)
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seleção para padrão mensal */}
              {formData.pattern === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dia do Mês
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={(e) => setFormData({...formData, dayOfMonth: parseInt(e.target.value)})}
                    className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Horário e Duração */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Horário e Duração</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Período */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Período</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Local */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Local</h3>
              
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!formData.isOnline}
                    onChange={() => setFormData({...formData, isOnline: false})}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Presencial</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.isOnline}
                    onChange={() => setFormData({...formData, isOnline: true})}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Online</span>
                </label>
              </div>
              
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={formData.isOnline ? "Link da reunião" : "Endereço ou local"}
              />
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Aqui seria a lógica para salvar
                setShowCreateModal(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Agendamento Recorrente
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos Recorrentes</h1>
            <p className="text-gray-600 mt-1">Gerencie sessões que se repetem automaticamente</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Novo Recorrente</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
        {[
          { id: 'active', label: 'Ativos', count: 2 },
          { id: 'paused', label: 'Pausados', count: 1 },
          { id: 'ended', label: 'Finalizados', count: 0 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{tab.label}</span>
            {tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de Agendamentos Recorrentes */}
      <div className="space-y-4">
        {recurringSchedules
          .filter(schedule => {
            if (activeTab === 'active') return schedule.status === 'active';
            if (activeTab === 'paused') return schedule.status === 'paused';
            if (activeTab === 'ended') return schedule.status === 'ended';
            return true;
          })
          .map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{schedule.title}</h3>
                    <PatternBadge pattern={schedule.pattern} />
                    <StatusBadge status={schedule.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Atleta</p>
                      <p className="font-medium flex items-center gap-2">
                        <Users size={16} />
                        {schedule.athlete.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Horário</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock size={16} />
                        {schedule.frequency.time} ({schedule.duration} min)
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Próxima Sessão</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar size={16} />
                        {schedule.nextOccurrence || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Progresso</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(schedule.completedOccurrences / (schedule.totalOccurrences || 100)) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {schedule.completedOccurrences}/{schedule.totalOccurrences || '∞'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dias da semana */}
                  {schedule.frequency.days && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Dias:</span>
                      <div className="flex gap-1">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                          <span
                            key={day}
                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium ${
                              schedule.frequency.days?.includes(day)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {day.slice(0, 1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  {schedule.status === 'active' && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Pausar">
                      <Pause size={18} />
                    </button>
                  )}
                  {schedule.status === 'paused' && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Retomar">
                      <Play size={18} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Editar">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Duplicar">
                    <Copy size={18} />
                  </button>
                  <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação */}
      {showCreateModal && <CreateRecurringModal />}
    </div>
  );
};

export default RecurringView;