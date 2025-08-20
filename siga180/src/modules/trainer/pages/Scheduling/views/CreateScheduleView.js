// src/modules/trainer/pages/Scheduling/views/CreateScheduleView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  FileText,
  Bell,
  RefreshCw,
  Save,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  Users,
  Home,
  Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { supabase } from '../../../../../services/supabase/supabaseClient';

const CreateScheduleView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Estado do formulário
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [athletes, setAthletes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    athlete_id: '',
    title: '',
    description: '',
    scheduled_date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    type: 'training',
    status: 'scheduled',
    location: '',
    is_online: false,
    meeting_link: '',
    notes: '',
    reminder_minutes: 60,
    color: '#3B82F6',
    // Recorrência
    is_recurring: false,
    recurring_pattern: {
      frequency: 'weekly', // daily, weekly, monthly
      interval: 1,
      daysOfWeek: [],
      endDate: null,
      occurrences: 1
    }
  });

  // Tipos de sessão
  const sessionTypes = [
    { value: 'training', label: 'Treino', icon: '💪', color: 'blue' },
    { value: 'consultation', label: 'Consulta', icon: '🗣️', color: 'purple' },
    { value: 'assessment', label: 'Avaliação', icon: '📊', color: 'green' },
    { value: 'recovery', label: 'Recuperação', icon: '🧘', color: 'orange' },
    { value: 'group_class', label: 'Aula em Grupo', icon: '👥', color: 'pink' },
    { value: 'online', label: 'Online', icon: '💻', color: 'indigo' },
    { value: 'other', label: 'Outro', icon: '📝', color: 'gray' }
  ];

  // Opções de lembrete
  const reminderOptions = [
    { value: 0, label: 'Sem lembrete' },
    { value: 15, label: '15 minutos antes' },
    { value: 30, label: '30 minutos antes' },
    { value: 60, label: '1 hora antes' },
    { value: 120, label: '2 horas antes' },
    { value: 1440, label: '1 dia antes' }
  ];

  // Buscar atletas
  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      
      // Buscar atletas do trainer
      const { data, error } = await supabase
        .from('athlete_trainer')
        .select(`
          athlete:profiles!athlete_trainer_athlete_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('trainer_id', user?.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching athletes:', error);
        toast.error('Erro ao carregar atletas');
      } else {
        const athletesList = data?.map(item => ({
          id: item.athlete.id,
          full_name: item.athlete.full_name,
          email: item.athlete.email,
          avatar_url: item.athlete.avatar_url,
          initials: item.athlete.full_name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase() || '??'
        })) || [];
        
        setAthletes(athletesList);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar duração quando mudar horário
  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01 ${formData.start_time}`);
      const end = new Date(`2000-01-01 ${formData.end_time}`);
      const diffMs = end - start;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins > 0) {
        setFormData(prev => ({ ...prev, duration_minutes: diffMins }));
      }
    }
  }, [formData.start_time, formData.end_time]);

  // Filtrar atletas baseado na pesquisa
  const filteredAthletes = athletes.filter(athlete =>
    athlete.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.athlete_id) {
      toast.error('Selecione um atleta');
      return;
    }
    
    if (!formData.title) {
      toast.error('Adicione um título');
      return;
    }
    
    if (!formData.scheduled_date) {
      toast.error('Selecione uma data');
      return;
    }
    
    if (!formData.start_time || !formData.end_time) {
      toast.error('Defina o horário');
      return;
    }
    
    if (formData.is_online && !formData.meeting_link) {
      toast.error('Adicione o link da reunião');
      return;
    }

    try {
      setSaving(true);
      
      // Preparar dados para salvar
      const scheduleData = {
        trainer_id: user?.id,
        athlete_id: formData.athlete_id,
        title: formData.title,
        description: formData.description,
        scheduled_date: formData.scheduled_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        duration_minutes: formData.duration_minutes,
        type: formData.type,
        status: formData.status,
        location: formData.is_online ? null : formData.location,
        is_online: formData.is_online,
        meeting_link: formData.is_online ? formData.meeting_link : null,
        notes: formData.notes,
        reminder_minutes: formData.reminder_minutes,
        color: formData.color,
        is_recurring: formData.is_recurring,
        recurring_pattern: formData.is_recurring ? formData.recurring_pattern : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Se for recorrente, criar múltiplos agendamentos
      if (formData.is_recurring) {
        await createRecurringSchedules(scheduleData);
      } else {
        // Criar agendamento único
        const { error } = await supabase
          .from('schedules')
          .insert([scheduleData]);

        if (error) {
          console.error('Error creating schedule:', error);
          toast.error('Erro ao criar agendamento');
        } else {
          toast.success('Agendamento criado com sucesso!');
          navigate('/schedule');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao criar agendamento');
    } finally {
      setSaving(false);
    }
  };

  // Criar agendamentos recorrentes
  const createRecurringSchedules = async (baseSchedule) => {
    try {
      const schedules = [];
      const { frequency, interval, occurrences } = formData.recurring_pattern;
      const startDate = new Date(formData.scheduled_date);
      
      for (let i = 0; i < occurrences; i++) {
        const scheduleDate = new Date(startDate);
        
        if (frequency === 'daily') {
          scheduleDate.setDate(startDate.getDate() + (i * interval));
        } else if (frequency === 'weekly') {
          scheduleDate.setDate(startDate.getDate() + (i * 7 * interval));
        } else if (frequency === 'monthly') {
          scheduleDate.setMonth(startDate.getMonth() + (i * interval));
        }
        
        schedules.push({
          ...baseSchedule,
          scheduled_date: scheduleDate.toISOString().split('T')[0],
          parent_schedule_id: i === 0 ? null : schedules[0].id,
          occurrence_number: i + 1
        });
      }
      
      const { error } = await supabase
        .from('schedules')
        .insert(schedules);

      if (error) {
        console.error('Error creating recurring schedules:', error);
        toast.error('Erro ao criar agendamentos recorrentes');
      } else {
        toast.success(`${schedules.length} agendamentos criados com sucesso!`);
        navigate('/schedule');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao criar agendamentos recorrentes');
    }
  };

  // Atualizar campo do formulário
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Atualizar padrão de recorrência
  const updateRecurringPattern = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurring_pattern: {
        ...prev.recurring_pattern,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/schedule')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novo Agendamento</h1>
                <p className="text-sm text-gray-600 mt-1">Agende uma nova sessão com um atleta</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/schedule')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                
                <div className="space-y-4">
                  {/* Atleta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User size={16} className="inline mr-1" />
                      Atleta *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowAthleteDropdown(true);
                        }}
                        onFocus={() => setShowAthleteDropdown(true)}
                        placeholder="Pesquisar atleta..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      {showAthleteDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredAthletes.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">
                              Nenhum atleta encontrado
                            </div>
                          ) : (
                            filteredAthletes.map(athlete => (
                              <button
                                key={athlete.id}
                                type="button"
                                onClick={() => {
                                  updateField('athlete_id', athlete.id);
                                  setSearchTerm(athlete.full_name);
                                  setShowAthleteDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                              >
                                {athlete.avatar_url ? (
                                  <img 
                                    src={athlete.avatar_url} 
                                    alt={athlete.full_name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                    {athlete.initials}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{athlete.full_name}</p>
                                  <p className="text-xs text-gray-500">{athlete.email}</p>
                                </div>
                                {formData.athlete_id === athlete.id && (
                                  <CheckCircle size={16} className="text-green-500 ml-auto" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText size={16} className="inline mr-1" />
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Ex: Treino de Força"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Detalhes sobre a sessão..."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Tipo de Sessão */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Sessão
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {sessionTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateField('type', type.value)}
                          className={`
                            p-3 rounded-lg border-2 transition-all
                            ${formData.type === type.value 
                              ? `border-${type.color}-500 bg-${type.color}-50` 
                              : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-xs font-medium">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data e Horário</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Data */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar size={16} className="inline mr-1" />
                        Data *
                      </label>
                      <input
                        type="date"
                        value={formData.scheduled_date}
                        onChange={(e) => updateField('scheduled_date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Hora Início */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock size={16} className="inline mr-1" />
                        Início *
                      </label>
                      <input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => updateField('start_time', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Hora Fim */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock size={16} className="inline mr-1" />
                        Fim *
                      </label>
                      <input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => updateField('end_time', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Duração calculada */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Duração: <span className="font-medium text-gray-900">{formData.duration_minutes} minutos</span>
                    </p>
                  </div>

                  {/* Recorrência */}
                  <div className="border-t pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_recurring}
                        onChange={(e) => updateField('is_recurring', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <RefreshCw size={16} />
                      <span className="font-medium">Agendamento Recorrente</span>
                    </label>
                    
                    {formData.is_recurring && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequência
                            </label>
                            <select
                              value={formData.recurring_pattern.frequency}
                              onChange={(e) => updateRecurringPattern('frequency', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="daily">Diário</option>
                              <option value="weekly">Semanal</option>
                              <option value="monthly">Mensal</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Repetições
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="52"
                              value={formData.recurring_pattern.occurrences}
                              onChange={(e) => updateRecurringPattern('occurrences', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          Será criado {formData.recurring_pattern.occurrences} agendamento{formData.recurring_pattern.occurrences > 1 ? 's' : ''} {
                            formData.recurring_pattern.frequency === 'daily' ? 'diário' :
                            formData.recurring_pattern.frequency === 'weekly' ? 'semanal' :
                            'mensal'
                          }{formData.recurring_pattern.occurrences > 1 ? 's' : ''}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Localização</h2>
                
                <div className="space-y-4">
                  {/* Tipo de sessão */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('is_online', false)}
                      className={`
                        flex-1 p-3 rounded-lg border-2 transition-all
                        ${!formData.is_online 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <Home size={20} className="mx-auto mb-2" />
                      <div className="text-sm font-medium">Presencial</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateField('is_online', true)}
                      className={`
                        flex-1 p-3 rounded-lg border-2 transition-all
                        ${formData.is_online 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <Video size={20} className="mx-auto mb-2" />
                      <div className="text-sm font-medium">Online</div>
                    </button>
                  </div>

                  {/* Campos específicos */}
                  {formData.is_online ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Globe size={16} className="inline mr-1" />
                        Link da Reunião *
                      </label>
                      <input
                        type="url"
                        value={formData.meeting_link}
                        onChange={(e) => updateField('meeting_link', e.target.value)}
                        placeholder="https://zoom.us/..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={formData.is_online}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin size={16} className="inline mr-1" />
                        Local
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="Ex: Ginásio Principal, Sala 2"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
              {/* Notificações */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Bell size={16} className="inline mr-1" />
                    Lembrete
                  </label>
                  <select
                    value={formData.reminder_minutes}
                    onChange={(e) => updateField('reminder_minutes', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {reminderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    O atleta receberá uma notificação antes da sessão
                  </p>
                </div>
              </div>

              {/* Notas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas Internas</h2>
                
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Notas privadas sobre esta sessão..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estas notas são apenas visíveis para ti
                </p>
              </div>

              {/* Cor do Evento */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cor no Calendário</h2>
                
                <div className="grid grid-cols-5 gap-2">
                  {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6B7280'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateField('color', color)}
                      className={`
                        w-10 h-10 rounded-lg border-2 transition-all
                        ${formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Resumo</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Atleta:</span>
                    <span className="font-medium">
                      {athletes.find(a => a.id === formData.athlete_id)?.full_name || 'Não selecionado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {formData.scheduled_date ? new Date(formData.scheduled_date).toLocaleDateString('pt-PT') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">
                      {formData.start_time} - {formData.end_time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium">{formData.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">
                      {sessionTypes.find(t => t.value === formData.type)?.label}
                    </span>
                  </div>
                  {formData.is_recurring && (
                    <div className="pt-2 border-t">
                      <span className="text-orange-600 font-medium">
                        <RefreshCw size={14} className="inline mr-1" />
                        {formData.recurring_pattern.occurrences} ocorrências
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleView;