import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
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
  RefreshCw,
  Filter,
  Download,
  Upload,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

const EnhancedCalendar = () => {
  // Estados principais
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day, timeline
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSchedule, setDraggedSchedule] = useState(null);
  
  // Configurações de visualização
  const [viewSettings, setViewSettings] = useState({
    showWeekends: true,
    startHour: 6,
    endHour: 22,
    slotDuration: 30, // minutos
    colorBy: 'type', // type, athlete, status
    darkMode: false
  });

  // Mock data com mais detalhes
  useEffect(() => {
    const mockSchedules = [
      {
        id: 1,
        title: 'Treino de Força',
        athlete: { id: 1, name: 'João Silva', avatar: null, color: '#3B82F6' },
        date: '2025-01-22',
        startTime: '08:00',
        endTime: '09:00',
        type: 'training',
        status: 'confirmed',
        location: 'Ginásio Principal',
        isOnline: false,
        color: '#3B82F6',
        notes: 'Foco em membros superiores'
      },
      {
        id: 2,
        title: 'Cardio HIIT',
        athlete: { id: 2, name: 'Maria Santos', avatar: null, color: '#10B981' },
        date: '2025-01-22',
        startTime: '10:00',
        endTime: '10:45',
        type: 'training',
        status: 'scheduled',
        location: 'Sala de Cardio',
        isOnline: false,
        color: '#10B981'
      },
      {
        id: 3,
        title: 'Consulta Online',
        athlete: { id: 3, name: 'Pedro Costa', avatar: null, color: '#8B5CF6' },
        date: '2025-01-22',
        startTime: '14:00',
        endTime: '14:30',
        type: 'consultation',
        status: 'scheduled',
        isOnline: true,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        color: '#8B5CF6'
      },
      {
        id: 4,
        title: 'Avaliação Física',
        athlete: { id: 4, name: 'Ana Oliveira', avatar: null, color: '#F59E0B' },
        date: '2025-01-23',
        startTime: '09:00',
        endTime: '10:30',
        type: 'assessment',
        status: 'scheduled',
        location: 'Sala de Avaliação',
        isOnline: false,
        color: '#F59E0B'
      }
    ];
    
    setSchedules(mockSchedules);
  }, []);

  // Helpers para datas
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i)
      });
    }
    
    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getWeekDays = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    if (!viewSettings.showWeekends) {
      return days.slice(1, 6);
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getSchedulesForDay = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return schedules.filter(s => s.date === dateStr);
  };

  // Navegação
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Drag and Drop
  const handleDragStart = (e, schedule) => {
    setIsDragging(true);
    setDraggedSchedule(schedule);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (draggedSchedule) {
      const newDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Atualizar schedule
      setSchedules(prev => prev.map(s => 
        s.id === draggedSchedule.id 
          ? { ...s, date: newDateStr }
          : s
      ));
      
      setDraggedSchedule(null);
    }
  };

  // Componente de Vista Mensal
  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = getWeekDays();
    
    return (
      <div className="bg-white rounded-lg shadow">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => (
            <div key={index} className="p-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Dias do mês */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const daySchedules = getSchedulesForDay(day.fullDate);
            const isCurrentDay = isToday(day.fullDate);
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                } ${isDragging ? 'hover:bg-blue-50' : ''} ${
                  isCurrentDay ? 'bg-blue-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day.fullDate)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                  } ${isCurrentDay ? 'text-blue-600' : ''}`}>
                    {day.date}
                  </span>
                  {day.isCurrentMonth && (
                    <button
                      onClick={() => handleCreateSchedule(day.fullDate)}
                      className="opacity-0 hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
                
                {/* Mini eventos */}
                <div className="space-y-1">
                  {daySchedules.slice(0, 3).map((schedule) => (
                    <div
                      key={schedule.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, schedule)}
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowDetailModal(true);
                      }}
                      className={`px-1 py-0.5 text-xs rounded cursor-pointer hover:opacity-80 transition-opacity`}
                      style={{ backgroundColor: schedule.color + '20', color: schedule.color }}
                    >
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span className="font-medium">{schedule.startTime}</span>
                        <span className="truncate">{schedule.athlete.name}</span>
                      </div>
                    </div>
                  ))}
                  {daySchedules.length > 3 && (
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      +{daySchedules.length - 3} mais
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Componente de Vista Semanal
  const WeekView = () => {
    const hours = [];
    for (let i = viewSettings.startHour; i <= viewSettings.endHour; i++) {
      hours.push(i);
    }
    
    const weekStart = new Date(currentDate);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day;
    weekStart.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDays.push(date);
    }
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header com dias da semana */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 border-r"></div>
          {weekDays.map((date, index) => (
            <div key={index} className="p-3 text-center border-r last:border-r-0">
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString('pt-PT', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-semibold ${isToday(date) ? 'text-blue-600' : ''}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Grid de horários */}
        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-xs text-gray-500 border-r text-right">
                {String(hour).padStart(2, '0')}:00
              </div>
              {weekDays.map((date, dayIndex) => {
                const daySchedules = getSchedulesForDay(date).filter(s => {
                  const scheduleHour = parseInt(s.startTime.split(':')[0]);
                  return scheduleHour === hour;
                });
                
                return (
                  <div
                    key={dayIndex}
                    className="relative p-1 border-r last:border-r-0 hover:bg-gray-50"
                    style={{ minHeight: '60px' }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, date)}
                  >
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, schedule)}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowDetailModal(true);
                        }}
                        className="absolute left-1 right-1 p-1 rounded text-xs text-white cursor-pointer hover:opacity-90"
                        style={{
                          backgroundColor: schedule.color,
                          top: '2px',
                          height: `${(parseInt(schedule.endTime.split(':')[0]) - parseInt(schedule.startTime.split(':')[0])) * 60 - 4}px`
                        }}
                      >
                        <div className="font-medium">{schedule.title}</div>
                        <div className="opacity-90">{schedule.athlete.name}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Função para criar novo agendamento
  const handleCreateSchedule = (date) => {
    console.log('Criar agendamento para', date);
    // Aqui você redirecionaria para a página de criação ou abriria um modal
  };

  // Modal de Detalhes
  const DetailModal = () => {
    if (!selectedSchedule) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selectedSchedule.title}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                   style={{ backgroundColor: selectedSchedule.athlete.color }}>
                {selectedSchedule.athlete.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium">{selectedSchedule.athlete.name}</p>
                <p className="text-sm text-gray-600">Atleta</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Data</p>
                <p className="font-medium">{selectedSchedule.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Horário</p>
                <p className="font-medium">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Local</p>
              <p className="font-medium flex items-center gap-2">
                {selectedSchedule.isOnline ? (
                  <>
                    <Video size={16} />
                    Sessão Online
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    {selectedSchedule.location}
                  </>
                )}
              </p>
            </div>
            
            {selectedSchedule.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Notas</p>
                <p className="text-gray-700">{selectedSchedule.notes}</p>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
              Editar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Iniciar Sessão
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
            <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <span className="text-lg font-medium">{formatDate(currentDate)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Selector */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { id: 'month', label: 'Mês', icon: Grid3x3 },
                { id: 'week', label: 'Semana', icon: List },
                { id: 'day', label: 'Dia', icon: Calendar }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
                    viewMode === mode.id
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <mode.icon size={16} />
                  <span className="text-sm font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            
            <button
              onClick={() => setViewSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {viewSettings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'month' && <MonthView />}
      {viewMode === 'week' && <WeekView />}
      
      {/* Detail Modal */}
      {showDetailModal && <DetailModal />}
    </div>
  );
};

export default EnhancedCalendar;