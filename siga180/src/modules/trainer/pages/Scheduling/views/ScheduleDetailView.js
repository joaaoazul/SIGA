// src/modules/trainer/pages/Scheduling/views/ScheduleDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Video,
  RefreshCw,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../../../services/supabase/supabaseClient';
import CancelScheduleModal from '../components/CancelScheduleModal';

const ScheduleDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchScheduleDetails();
  }, [id]);

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true);

      // Buscar agendamento
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedules')
        .select(`
          *,
          athlete:athlete_id(
            id,
            name,
            email,
            phone,
            avatar_url
          ),
          trainer:trainer_id(
            id,
            name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (scheduleError) throw scheduleError;

      // Buscar attendance
      const { data: attendanceData } = await supabase
        .from('schedule_attendance')
        .select('*')
        .eq('schedule_id', id)
        .single();

      setSchedule(scheduleData);
      setAttendance(attendanceData);
      setNotes(scheduleData.notes || '');
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar agendamento');
      navigate('/trainer/schedule');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status) => {
    try {
      const { error } = await supabase
        .from('schedule_attendance')
        .upsert({
          schedule_id: id,
          athlete_id: schedule.athlete_id,
          status: status,
          marked_at: new Date().toISOString(),
          marked_by: schedule.trainer_id
        });

      if (error) throw error;

      // Atualizar status do agendamento
      if (status === 'present') {
        await supabase
          .from('schedules')
          .update({ status: 'completed' })
          .eq('id', id);
      } else if (status === 'absent') {
        await supabase
          .from('schedules')
          .update({ status: 'no_show' })
          .eq('id', id);
      }

      toast.success(`Presença marcada: ${status === 'present' ? 'Presente' : 'Ausente'}`);
      fetchScheduleDetails();
    } catch (error) {
      console.error('Erro ao marcar presença:', error);
      toast.error('Erro ao marcar presença');
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ notes: notes })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notas guardadas');
    } catch (error) {
      toast.error('Erro ao guardar notas');
    } finally {
      setSavingNotes(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'scheduled': 'Agendado',
      'confirmed': 'Confirmado',
      'completed': 'Concluído',
      'cancelled': 'Cancelado',
      'no_show': 'Não Compareceu'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-12">
        <p>Agendamento não encontrado</p>
      </div>
    );
  }

  const isToday = new Date(schedule.scheduled_date).toDateString() === new Date().toDateString();
  const isPast = new Date(schedule.scheduled_date) < new Date();
  const canMarkAttendance = isToday || isPast;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/schedule')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{schedule.title}</h1>
                <p className="text-sm text-gray-600 mt-1">Detalhes do agendamento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                {getStatusLabel(schedule.status)}
              </span>
              
              {schedule.status !== 'cancelled' && schedule.status !== 'completed' && (
                <>
                  <button
                    onClick={() => navigate(`/trainer/schedule/edit/${id}`)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Principais */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Informações da Sessão</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="font-medium">
                        {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Horário</p>
                      <p className="font-medium">
                        {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Duração: {schedule.duration_minutes} minutos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {schedule.is_online ? (
                      <>
                        <Video className="text-gray-400 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Formato</p>
                          <p className="font-medium">Online</p>
                          {schedule.meeting_link && (
                            <a
                              href={schedule.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Entrar na reunião
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="text-gray-400 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-gray-600">Local</p>
                          <p className="font-medium">{schedule.location || 'Presencial'}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <RefreshCw className="text-gray-400 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium capitalize">{schedule.type}</p>
                      {schedule.is_recurring && (
                        <span className="text-xs text-orange-600">Sessão recorrente</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {schedule.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-600">{schedule.description}</p>
                </div>
              )}
            </div>

            {/* Controlo de Presença */}
            {canMarkAttendance && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Controlo de Presença</h2>
                
                {attendance ? (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        Status: {attendance.status === 'present' ? 'Presente' : 'Ausente'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Marcado em {new Date(attendance.marked_at).toLocaleString('pt-PT')}
                      </p>
                    </div>
                    {attendance.status === 'present' ? (
                      <CheckCircle className="text-green-600" size={32} />
                    ) : (
                      <XCircle className="text-red-600" size={32} />
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => markAttendance('present')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={20} />
                      Marcar Presente
                    </button>
                    <button
                      onClick={() => markAttendance('absent')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={20} />
                      Marcar Ausente
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notas Internas</h2>
                <button
                  onClick={saveNotes}
                  disabled={savingNotes}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingNotes ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione notas sobre esta sessão..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Informação do Atleta */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Atleta</h2>
              
              <div className="flex items-center gap-4 mb-4">
                {schedule.athlete?.avatar_url ? (
                  <img
                    src={schedule.athlete.avatar_url}
                    alt={schedule.athlete.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-600" size={24} />
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {schedule.athlete?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {schedule.athlete?.email}
                  </p>
                  {schedule.athlete?.phone && (
                    <p className="text-sm text-gray-600">
                      {schedule.athlete.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/trainer/athletes/${schedule.athlete_id}`)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Ver Perfil
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <MessageSquare size={16} className="inline mr-1" />
                  Mensagem
                </button>
              </div>
            </div>

            {/* Confirmação do Atleta */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Confirmação</h2>
              
              {schedule.athlete_confirmed ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-900">Presença Confirmada</p>
                    <p className="text-xs text-green-700">
                      {new Date(schedule.athlete_confirmed_at).toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="text-orange-600" size={20} />
                  <div>
                    <p className="font-medium text-orange-900">Aguardando Confirmação</p>
                    <p className="text-xs text-orange-700">
                      Atleta ainda não confirmou presença
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Ações</h2>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Send className="inline mr-2" size={16} />
                  Enviar Lembrete
                </button>
                
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <RefreshCw className="inline mr-2" size={16} />
                  Reagendar
                </button>
                
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <DollarSign className="inline mr-2" size={16} />
                  Marcar como Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      <CancelScheduleModal
        schedule={schedule}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={() => {
          fetchScheduleDetails();
          setShowCancelModal(false);
        }}
      />
    </div>
  );
};

export default ScheduleDetailView;