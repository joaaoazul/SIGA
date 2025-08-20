// src/modules/athlete/pages/Schedule/views/DashboardView.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, User, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import { useAuth } from '../../../../shared/hooks/useAuth';

const DashboardView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar agendamentos
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          trainer:trainer_id(
            id,
            name,
            email,
            phone
          )
        `)
        .eq('athlete_id', user?.id)
        .gte('scheduled_date', today)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Separar hoje dos próximos
      const todayItems = data?.filter(s => s.scheduled_date === today) || [];
      const upcoming = data?.filter(s => s.scheduled_date > today) || [];

      setTodaySchedule(todayItems[0] || null);
      setUpcomingSchedules(upcoming.slice(0, 5));
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const confirmAttendance = async (scheduleId) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({
          athlete_confirmed: true,
          athlete_confirmed_at: new Date().toISOString()
        })
        .eq('id', scheduleId)
        .eq('athlete_id', user?.id);

      if (error) throw error;

      toast.success('Presença confirmada!');
      fetchSchedules();
    } catch (error) {
      console.error('Error confirming attendance:', error);
      toast.error('Erro ao confirmar presença');
    }
  };

  const formatTime = (time) => {
    return time?.slice(0, 5) || '';
  };

  const formatDate = (date) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sessão de Hoje */}
      {todaySchedule && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Sessão de Hoje</h2>
            <span className="text-sm opacity-90">
              {formatTime(todaySchedule.start_time)} - {formatTime(todaySchedule.end_time)}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{todaySchedule.title}</h3>
          
          {todaySchedule.description && (
            <p className="mb-4 opacity-90">{todaySchedule.description}</p>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            {todaySchedule.is_online ? (
              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>Online</span>
              </div>
            ) : todaySchedule.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{todaySchedule.location}</span>
              </div>
            )}
            
            {todaySchedule.trainer && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{todaySchedule.trainer.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {!todaySchedule.athlete_confirmed && (
              <button
                onClick={() => confirmAttendance(todaySchedule.id)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Confirmar Presença
              </button>
            )}
            
            {todaySchedule.is_online && todaySchedule.meeting_link && (
              <a
                href={todaySchedule.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                Entrar na Sessão
              </a>
            )}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Este Mês</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-500">Sessões agendadas</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-500">Taxa: 67%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próxima</p>
              <p className="text-2xl font-bold">
                {upcomingSchedules[0] ? 
                  new Date(upcomingSchedules[0].scheduled_date).getDate() : 
                  '-'
                }
              </p>
              <p className="text-xs text-gray-500">
                {upcomingSchedules[0] ? 
                  new Date(upcomingSchedules[0].scheduled_date).toLocaleDateString('pt-PT', { month: 'short' }) : 
                  'Sem sessões'
                }
              </p>
            </div>
            <Clock className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Próximas Sessões */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Próximas Sessões</h2>
            <button
              onClick={() => navigate('/athlete/schedule')}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todas
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="divide-y">
          {upcomingSchedules.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Não há sessões agendadas
            </div>
          ) : (
            upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {schedule.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {getStatusLabel(schedule.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(schedule.scheduled_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                      </div>
                      {schedule.is_online ? (
                        <div className="flex items-center gap-1">
                          <Video size={14} />
                          <span>Online</span>
                        </div>
                      ) : schedule.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{schedule.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!schedule.athlete_confirmed && schedule.status === 'scheduled' && (
                    <button
                      onClick={() => confirmAttendance(schedule.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Confirmar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;