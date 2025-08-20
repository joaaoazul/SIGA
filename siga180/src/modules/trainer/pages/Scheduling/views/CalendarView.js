// src/modules/trainer/pages/Scheduling/views/CalendarView.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Grid3x3,
  List,
  Clock,
  Users,
  MapPin,
  Video,
  Eye,
  Edit,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { supabase } from '../../../../../services/supabase/supabaseClient';

const CalendarView = () => {
  const navigate = useNavigate();
  const { date: urlDate } = useParams();
  const { user } = useAuth();
  
  // Estado principal
  const [currentDate, setCurrentDate] = useState(
    urlDate ? new Date(urlDate) : new Date()
  );
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    athleteId: 'all',
    status: 'all',
    type: 'all'
  });
  
  // Lista de atletas para o filtro
  const [athletes, setAthletes] = useState([]);
  
  // Modal de detalhes
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ========================================
  // FETCH DATA DO SUPABASE
  // ========================================

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      
      // Determinar intervalo de datas baseado no modo de visualização
      let dateFrom, dateTo;
      
      if (viewMode === 'month') {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        dateFrom = firstDay.toISOString().split('T')[0];
        dateTo = lastDay.toISOString().split('T')[0];
      } else if (viewMode === 'week') {
        const weekStart = new Date(currentDate);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        dateFrom = weekStart.toISOString().split('T')[0];
        dateTo = weekEnd.toISOString().split('T')[0];
      } else {
        dateFrom = currentDate.toISOString().split('T')[0];
        dateTo = currentDate.toISOString().split('T')[0];
      }
      
      // Construir query
      let query = supabase
        .from('schedules')
        .select(`
          *,
          athlete:profiles!schedules_athlete_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('trainer_id', user?.id)
        .gte('scheduled_date', dateFrom)
        .lte('scheduled_date', dateTo)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      // Aplicar filtros
      if (filters.athleteId !== 'all') {
        query = query.eq('athlete_id', filters.athleteId);
      }
      
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching schedules:', error);
        toast.error('Erro ao carregar agendamentos');
      } else {
        // Processar dados
        const processedData = (data || []).map(schedule => ({
          ...schedule,
          athlete: {
            ...schedule.athlete,
            initials: schedule.athlete?.full_name
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase() || '??'
          }
        }));
        
        setSchedules(processedData);
        
        // Extrair lista única de atletas
        const uniqueAthletes = [];
        const athleteIds = new Set();
        
        processedData.forEach(schedule => {
          if (schedule.athlete && !athleteIds.has(schedule.athlete.id)) {
            athleteIds.add(schedule.athlete.id);
            uniqueAthletes.push({
              id: schedule.athlete.id,
              name: schedule.athlete.full_name
            });
          }
        });
        
        setAthletes(uniqueAthletes);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar calendário');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentDate, viewMode, filters, user]);

  useEffect(() => {
    if (user?.id) {
      fetchSchedules();
    }
  }, [fetchSchedules, user]);

  // ========================================
  // NAVEGAÇÃO
  // ========================================

  const navigatePeriod = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (7 * direction));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // ========================================
  // AÇÕES
  // ========================================

  const handleCreateSchedule = (date = null) => {
    if (date) {
      navigate(`/schedule/create?date=${date}`);
    } else {
      navigate('/schedule/create');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Tem certeza que deseja eliminar este agendamento?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) {
        toast.error('Erro ao eliminar agendamento');
      } else {
        toast.success('Agendamento eliminado com sucesso');
        fetchSchedules();
        setShowDetailModal(false);
      }
    } catch (error) {
      toast.error('Erro ao eliminar agendamento');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  // ========================================
  // FUNÇÕES DE UTILIDADE
  // ========================================

  const getTypeColor = (type) => {
    const colors = {
      training: 'blue',
      consultation: 'purple',
      assessment: 'green',
      recovery: 'orange',
      group_class: 'pink',
      online: 'indigo',
      other: 'gray'
    };
    return colors[type] || 'gray';
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { color: 'yellow', label: 'Agendado' },
      confirmed: { color: 'blue', label: 'Confirmado' },
      completed: { color: 'green', label: 'Concluído' },
      cancelled: { color: 'red', label: 'Cancelado' },
      no_show: { color: 'gray', label: 'Não compareceu' }
    };
    return badges[status] || { color: 'gray', label: status };
  };

  // ========================================
  // RENDER MONTH VIEW
  // ========================================

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
    
    const days = [];
    const currentMonth = currentDate.getMonth();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const daySchedules = schedules.filter(s => s.scheduled_date === dateStr);
      
      days.push({
        date,
        dateStr,
        schedules: daySchedules,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header com dias da semana */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`
                bg-white p-2 min-h-[120px] relative
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                ${day.isToday ? 'bg-blue-50' : ''}
                hover:bg-gray-50 transition-colors
              `}
            >
              {/* Cabeçalho do dia */}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  day.isToday ? 'text-blue-600' : ''
                }`}>
                  {day.date.getDate()}
                </span>
                {day.schedules.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {day.schedules.length}
                  </span>
                )}
              </div>
              
              {/* Eventos do dia */}
              <div className="space-y-1">
                {day.schedules.slice(0, 3).map(schedule => (
                  <div
                    key={schedule.id}
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setShowDetailModal(true);
                    }}
                    className={`
                      text-xs p-1 rounded cursor-pointer truncate
                      bg-${getTypeColor(schedule.type)}-100 
                      text-${getTypeColor(schedule.type)}-700
                      hover:bg-${getTypeColor(schedule.type)}-200
                      transition-colors
                    `}
                    title={`${schedule.start_time?.slice(0, 5)} - ${schedule.athlete?.full_name} - ${schedule.title}`}
                  >
                    <span className="font-medium">
                      {schedule.start_time?.slice(0, 5)}
                    </span>
                    {' '}
                    {schedule.athlete?.full_name?.split(' ')[0]}
                  </div>
                ))}
                {day.schedules.length > 3 && (
                  <button
                    onClick={() => {
                      setCurrentDate(day.date);
                      setViewMode('day');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    +{day.schedules.length - 3} mais
                  </button>
                )}
              </div>
              
              {/* Botão de adicionar */}
              {day.isCurrentMonth && (
                <button
                  onClick={() => handleCreateSchedule(day.dateStr)}
                  className="absolute bottom-1 right-1 p-1 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Plus size={14} className="text-gray-400 hover:text-blue-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========================================
  // RENDER WEEK VIEW
  // ========================================

  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);
    
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 às 20:00
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header com dias */}
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            <div className="bg-gray-50 p-2"></div>
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`
                  bg-gray-50 p-2 text-center
                  ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''}
                `}
              >
                <div className="text-xs text-gray-600">
                  {day.toLocaleDateString('pt-PT', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${
                  day.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Grid de horários */}
          <div className="divide-y divide-gray-100">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-px bg-gray-200">
                {/* Hora */}
                <div className="bg-gray-50 p-2 text-right text-sm text-gray-600">
                  {hour}:00
                </div>
                
                {/* Slots para cada dia */}
                {days.map(day => {
                  const dateStr = day.toISOString().split('T')[0];
                  const hourSchedules = schedules.filter(s => {
                    if (s.scheduled_date !== dateStr) return false;
                    const scheduleHour = parseInt(s.start_time?.split(':')[0] || 0);
                    return scheduleHour === hour;
                  });
                  
                  return (
                    <div
                      key={`${dateStr}-${hour}`}
                      className="bg-white p-1 min-h-[60px] hover:bg-gray-50 relative group"
                    >
                      {hourSchedules.map(schedule => (
                        <div
                          key={schedule.id}
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowDetailModal(true);
                          }}
                          className={`
                            p-1 mb-1 rounded text-xs cursor-pointer
                            bg-${getTypeColor(schedule.type)}-100 
                            text-${getTypeColor(schedule.type)}-700
                            hover:bg-${getTypeColor(schedule.type)}-200
                          `}
                        >
                          <div className="font-medium truncate">
                            {schedule.athlete?.full_name?.split(' ')[0]}
                          </div>
                          <div className="truncate text-xs opacity-75">
                            {schedule.title}
                          </div>
                        </div>
                      ))}
                      
                      {/* Botão de adicionar */}
                      <button
                        onClick={() => handleCreateSchedule(dateStr)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/50"
                      >
                        <Plus size={16} className="text-gray-400 hover:text-blue-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ========================================
  // RENDER DAY VIEW
  // ========================================

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const daySchedules = schedules
      .filter(s => s.scheduled_date === dateStr)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
    
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('pt-PT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-600">
            {daySchedules.length} agendamento{daySchedules.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="p-4">
          {daySchedules.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Sem agendamentos para este dia</p>
              <button
                onClick={() => handleCreateSchedule(dateStr)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Criar agendamento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {daySchedules.map(schedule => (
                <div
                  key={schedule.id}
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    setShowDetailModal(true);
                  }}
                  className={`
                    p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all
                    border-${getTypeColor(schedule.type)}-200
                    bg-${getTypeColor(schedule.type)}-50
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {schedule.start_time?.slice(0, 5) || '??:??'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {schedule.duration_minutes || 60} min
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{schedule.athlete?.full_name}</p>
                        <p className="text-sm text-gray-600">{schedule.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {schedule.is_online ? (
                            <span className="flex items-center gap-1 text-xs text-indigo-600">
                              <Video size={12} />
                              Online
                            </span>
                          ) : schedule.location && (
                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin size={12} />
                              {schedule.location}
                            </span>
                          )}
                          {schedule.athlete_confirmed && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle size={12} />
                              Confirmado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        bg-${getStatusBadge(schedule.status).color}-100
                        text-${getStatusBadge(schedule.status).color}-700
                      `}>
                        {getStatusBadge(schedule.status).label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie os seus agendamentos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Atualizar"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={() => handleCreateSchedule()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* View Mode */}
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'day' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dia
              </button>
            </div>

            {/* Filters */}
            <select
              value={filters.athleteId}
              onChange={(e) => setFilters({ ...filters, athleteId: e.target.value })}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="all">Todos os Atletas</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="all">Todos os Estados</option>
              <option value="scheduled">Agendado</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
              <option value="no_show">Não Compareceu</option>
            </select>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hoje
            </button>
            
            <button
              onClick={() => navigatePeriod(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="px-3 text-sm font-medium text-gray-900 min-w-[200px] text-center">
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                ? `Semana de ${currentDate.toLocaleDateString('pt-PT')}`
                : currentDate.toLocaleDateString('pt-PT', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })
              }
            </span>
            
            <button
              onClick={() => navigatePeriod(1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {/* Detail Modal */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalhes do Agendamento
                </h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSchedule(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title and Status */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">{selectedSchedule.title || 'Sessão de Treino'}</h4>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  bg-${getStatusBadge(selectedSchedule.status).color}-100
                  text-${getStatusBadge(selectedSchedule.status).color}-700
                `}>
                  {getStatusBadge(selectedSchedule.status).label}
                </span>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Atleta</p>
                  <p className="font-medium">{selectedSchedule.athlete?.full_name || 'Sem atleta'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data</p>
                  <p className="font-medium">
                    {new Date(selectedSchedule.scheduled_date).toLocaleDateString('pt-PT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Horário</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock size={14} />
                    {selectedSchedule.start_time?.slice(0, 5)} - {selectedSchedule.end_time?.slice(0, 5)}
                    <span className="text-sm text-gray-600">
                      ({selectedSchedule.duration_minutes || 60} min)
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Localização</p>
                  <p className="font-medium flex items-center gap-1">
                    {selectedSchedule.is_online ? (
                      <>
                        <Video size={14} />
                        Online
                        {selectedSchedule.meeting_link && (
                          <a 
                            href={selectedSchedule.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            Entrar
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <MapPin size={14} />
                        {selectedSchedule.location || 'Presencial'}
                      </>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo</p>
                  <p className="font-medium">
                    <span className={`
                      inline-flex px-2 py-1 rounded text-xs
                      bg-${getTypeColor(selectedSchedule.type)}-100
                      text-${getTypeColor(selectedSchedule.type)}-700
                    `}>
                      {selectedSchedule.type === 'training' ? 'Treino' :
                       selectedSchedule.type === 'consultation' ? 'Consulta' :
                       selectedSchedule.type === 'assessment' ? 'Avaliação' :
                       selectedSchedule.type === 'recovery' ? 'Recuperação' :
                       selectedSchedule.type === 'group_class' ? 'Aula em Grupo' :
                       selectedSchedule.type === 'online' ? 'Online' :
                       'Outro'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confirmação do Atleta</p>
                  <p className="font-medium">
                    {selectedSchedule.athlete_confirmed ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        Confirmado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <AlertCircle size={14} />
                        Aguardando confirmação
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Description */}
              {selectedSchedule.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Descrição</p>
                  <p className="text-gray-700">{selectedSchedule.description}</p>
                </div>
              )}
              
              {/* Notes */}
              {selectedSchedule.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notas</p>
                  <p className="text-gray-700">{selectedSchedule.notes}</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t flex items-center justify-between">
              <button
                onClick={() => {
                  handleDeleteSchedule(selectedSchedule.id);
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} className="inline mr-2" />
                Eliminar
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    navigate(`/schedule/detail/${selectedSchedule.id}`);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye size={16} className="inline mr-2" />
                  Ver Detalhes
                </button>
                
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    navigate(`/schedule/edit/${selectedSchedule.id}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} className="inline mr-2" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;