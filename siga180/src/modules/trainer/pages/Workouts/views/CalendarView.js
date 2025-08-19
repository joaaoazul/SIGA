// src/modules/trainer/pages/Workouts/views/CalendarView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Grid,
  List
} from 'lucide-react';
import workoutService from '../services/workoutService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../../shared/hooks/useAuth';

const CalendarView = () => {
  const navigate = useNavigate();
  const { date: urlDate } = useParams();
  const { user } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(urlDate ? new Date(urlDate) : new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterAthlete, setFilterAthlete] = useState('all');
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Buscar sessões do Supabase
  const fetchSessions = async () => {
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
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        dateFrom = weekStart.toISOString().split('T')[0];
        dateTo = weekEnd.toISOString().split('T')[0];
      } else {
        dateFrom = currentDate.toISOString().split('T')[0];
        dateTo = currentDate.toISOString().split('T')[0];
      }
      
      const filters = {
        dateFrom,
        dateTo
      };
      
      if (filterAthlete !== 'all') {
        filters.athleteId = filterAthlete;
      }
      
      const result = await workoutService.getWorkoutSessions(filters);
      
      if (result.success && result.data) {
        setSessions(result.data);
        
        // Extrair lista única de atletas
        const uniqueAthletes = Array.from(new Set(
          result.data.map(s => JSON.stringify({
            id: s.athlete_id,
            name: s.athlete?.name || 'Atleta'
          }))
        )).map(str => JSON.parse(str));
        
        setAthletes(uniqueAthletes);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Erro ao carregar sessões');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentDate, viewMode, filterAthlete]);

  // Funções de navegação
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
    setSelectedDate(new Date());
  };

  // Handlers
  const handleStartSession = async (session) => {
    try {
      const result = await workoutService.startWorkoutSession(session.id);
      if (result.success) {
        toast.success('Sessão iniciada!');
        fetchSessions();
      }
    } catch (error) {
      toast.error('Erro ao iniciar sessão');
    }
  };

  const handleCompleteSession = async (session) => {
    try {
      const result = await workoutService.completeWorkoutSession(session.id, {
        totalVolume: 0, // TODO: Calcular volume real
        notes: ''
      });
      if (result.success) {
        toast.success('Sessão concluída!');
        fetchSessions();
      }
    } catch (error) {
      toast.error('Erro ao concluir sessão');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Tem certeza que deseja eliminar esta sessão?')) return;
    
    try {
      // TODO: Implementar delete no service
      toast.success('Sessão eliminada!');
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      toast.error('Erro ao eliminar sessão');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  // Renderizar calendário mensal
  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentMonth = currentDate.getMonth();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayStr = date.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.scheduled_date === dayStr);
      
      days.push({
        date,
        dayStr,
        sessions: daySessions,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString()
      });
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDate(day.date)}
              className={`
                bg-white p-2 min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                ${day.isToday ? 'bg-blue-50' : ''}
                ${day.isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  day.isToday ? 'text-blue-600' : ''
                }`}>
                  {day.date.getDate()}
                </span>
                {day.sessions.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {day.sessions.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {day.sessions.slice(0, 3).map(session => (
                  <div
                    key={session.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSession(session);
                      setShowSessionModal(true);
                    }}
                    className={`
                      text-xs p-1 rounded truncate cursor-pointer
                      ${session.status === 'completed' ? 'bg-green-100 text-green-700' :
                        session.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'}
                    `}
                    title={`${session.athlete?.name} - ${session.workout_template?.name}`}
                  >
                    {session.athlete?.name?.split(' ')[0]}
                  </div>
                ))}
                {day.sessions.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.sessions.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar visualização semanal
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 às 20:00
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
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
                <div className="text-sm font-medium text-gray-700">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day.getDay()]}
                </div>
                <div className={`text-lg ${
                  day.toDateString() === new Date().toDateString() ? 'text-blue-600 font-bold' : ''
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {hours.map(hour => (
              <React.Fragment key={hour}>
                <div className="bg-gray-50 p-2 text-right text-sm text-gray-500">
                  {hour}:00
                </div>
                {days.map((day, dayIdx) => {
                  const dayStr = day.toISOString().split('T')[0];
                  const hourSessions = sessions.filter(s => {
                    if (s.scheduled_date !== dayStr) return false;
                    const sessionHour = new Date(s.scheduled_date).getHours();
                    return sessionHour === hour;
                  });
                  
                  return (
                    <div
                      key={`${hour}-${dayIdx}`}
                      className="bg-white p-1 min-h-[60px] hover:bg-gray-50"
                    >
                      {hourSessions.map(session => (
                        <div
                          key={session.id}
                          onClick={() => {
                            setSelectedSession(session);
                            setShowSessionModal(true);
                          }}
                          className={`
                            text-xs p-1 mb-1 rounded cursor-pointer
                            ${session.status === 'completed' ? 'bg-green-100 text-green-700' :
                              session.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'}
                          `}
                        >
                          <div className="font-medium truncate">
                            {session.athlete?.name?.split(' ')[0]}
                          </div>
                          <div className="truncate">
                            {session.workout_template?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar visualização diária
  const renderDayView = () => {
    const dayStr = currentDate.toISOString().split('T')[0];
    const daySessions = sessions
      .filter(s => s.scheduled_date === dayStr)
      .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentDate.toLocaleDateString('pt-PT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        {daySessions.length > 0 ? (
          <div className="space-y-4">
            {daySessions.map(session => (
              <div
                key={session.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/workouts/session/${session.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      session.status === 'completed' ? 'bg-green-100' :
                      session.status === 'in_progress' ? 'bg-blue-100' :
                      session.status === 'cancelled' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {session.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : session.status === 'in_progress' ? (
                        <Play className="h-5 w-5 text-blue-600" />
                      ) : session.status === 'cancelled' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {session.workout_template?.name || 'Treino'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {session.athlete?.name || 'Atleta'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {session.workout_template?.estimated_duration_minutes || 60} min
                    </span>
                    
                    {session.status === 'scheduled' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartSession(session);
                          }}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Iniciar sessão"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/workouts/session/${session.id}/execute`);
                          }}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                      </>
                    )}
                    
                    {session.status === 'in_progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteSession(session);
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
                
                {session.session_exercises && session.session_exercises.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      {session.session_exercises.length} exercícios
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Sem sessões agendadas para este dia</p>
            <button
              onClick={() => navigate('/workouts/assign')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agendar Sessão
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário de Treinos</h1>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie as sessões agendadas
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
            onClick={() => navigate('/workouts/assign')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Agendar Sessão
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white shadow-sm' : ''
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white shadow-sm' : ''
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'day' ? 'bg-white shadow-sm' : ''
                }`}
              >
                Dia
              </button>
            </div>

            {/* Filter */}
            <select
              value={filterAthlete}
              onChange={(e) => setFilterAthlete(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="all">Todos os Atletas</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
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
            
            <span className="px-3 text-sm font-medium text-gray-900">
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

      {/* Session Details Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes da Sessão
              </h3>
              <button
                onClick={() => {
                  setShowSessionModal(false);
                  setSelectedSession(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Treino</p>
                <p className="font-medium">{selectedSession.workout_template?.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Atleta</p>
                <p className="font-medium">{selectedSession.athlete?.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-medium">
                  {new Date(selectedSession.scheduled_date).toLocaleDateString('pt-PT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Duração</p>
                <p className="font-medium">
                  {selectedSession.workout_template?.estimated_duration_minutes || 60} minutos
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  selectedSession.status === 'completed' ? 'bg-green-100 text-green-700' :
                  selectedSession.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  selectedSession.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedSession.status === 'completed' ? 'Concluída' :
                   selectedSession.status === 'in_progress' ? 'Em Progresso' :
                   selectedSession.status === 'cancelled' ? 'Cancelada' :
                   'Agendada'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  navigate(`/workouts/session/${selectedSession.id}`);
                  setShowSessionModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Detalhes
              </button>
              
              {selectedSession.status === 'scheduled' && (
                <button
                  onClick={() => {
                    handleStartSession(selectedSession);
                    setShowSessionModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Iniciar
                </button>
              )}
              
              <button
                onClick={() => {
                  handleDeleteSession(selectedSession.id);
                  setShowSessionModal(false);
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;