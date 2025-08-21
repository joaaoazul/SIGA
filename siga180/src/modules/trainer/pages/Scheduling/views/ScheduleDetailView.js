import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  FileText,
  Edit,
  Trash2,
  Share2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Bell,
  RefreshCw,
  Download,
  Send,
  Phone,
  Mail,
  Loader2,
  History,
  DollarSign,
  Star,
  ChevronRight
} from 'lucide-react';

const ScheduleDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSchedule({
        id: id,
        title: 'Treino de Força - Upper Body',
        description: 'Sessão focada em desenvolvimento de força para membros superiores com ênfase em movimentos compostos.',
        athlete: {
          id: 1,
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+351 912 345 678',
          avatar: null,
          age: 28,
          memberSince: '2024-01-15',
          totalSessions: 45,
          missedSessions: 2
        },
        scheduled_date: '2025-01-24',
        start_time: '10:00',
        end_time: '11:00',
        duration_minutes: 60,
        type: 'training',
        status: 'confirmed',
        location: 'Ginásio Principal - Sala 2',
        is_online: false,
        meeting_link: null,
        athlete_confirmed: true,
        reminder_sent: true,
        reminder_minutes: 60,
        notes: 'Cliente prefere treinar com música própria. Foco em correção postural.',
        created_at: '2025-01-20T10:30:00',
        updated_at: '2025-01-21T14:15:00',
        workout_plan: {
          id: 5,
          name: 'Plano Força - Fase 2',
          week: 3,
          day: 2
        },
        history: [
          { date: '2025-01-21T14:15:00', action: 'confirmed', user: 'Atleta', note: 'Confirmado via app' },
          { date: '2025-01-20T15:00:00', action: 'reminder_sent', user: 'Sistema', note: 'Lembrete enviado por email' },
          { date: '2025-01-20T10:30:00', action: 'created', user: 'Trainer', note: 'Agendamento criado' }
        ],
        previous_sessions: [
          { date: '2025-01-17', status: 'completed', rating: 5, notes: 'Excelente progresso' },
          { date: '2025-01-10', status: 'completed', rating: 4, notes: 'Boa sessão' },
          { date: '2025-01-03', status: 'cancelled', rating: null, notes: 'Cliente doente' }
        ],
        payment: {
          status: 'pending',
          amount: 35,
          method: 'monthly_plan',
          sessions_remaining: 8
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDelete = () => {
    console.log('Eliminar agendamento');
    navigate('/schedule');
  };

  const handleReschedule = (newDateTime) => {
    console.log('Reagendar para:', newDateTime);
    setShowRescheduleModal(false);
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSendingReminder(false);
    alert('Lembrete enviado com sucesso!');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Adicionar nota:', newNote);
      setNewNote('');
    }
  };

  const handleCompleteSession = () => {
    console.log('Marcar como concluída');
  };

  const handleCancelSession = () => {
    console.log('Cancelar sessão');
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'yellow',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
      no_show: 'gray'
    };
    return colors[status] || 'gray';
  };

  const getTypeLabel = (type) => {
    const labels = {
      training: 'Treino',
      consultation: 'Consulta',
      assessment: 'Avaliação',
      recovery: 'Recuperação'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Agendamento não encontrado</p>
        <button
          onClick={() => navigate('/schedule')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Voltar aos agendamentos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/schedule')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{schedule.title}</h1>
              <p className="text-gray-600 mt-1">ID: #{schedule.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/schedule/edit/${schedule.id}`)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Edit size={18} />
              Editar
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={18} />
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <div className="flex">
                {['details', 'history', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab === 'details' ? 'Detalhes' : tab === 'history' ? 'Histórico' : 'Notas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informações da Sessão</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Data</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(schedule.scheduled_date).toLocaleDateString('pt-PT', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Horário</p>
                        <p className="font-medium flex items-center gap-2">
                          <Clock size={16} />
                          {schedule.start_time} - {schedule.end_time} ({schedule.duration_minutes} min)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-medium">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {getTypeLabel(schedule.type)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 bg-${getStatusColor(schedule.status)}-100 text-${getStatusColor(schedule.status)}-700 rounded-full text-sm`}>
                            {schedule.status === 'confirmed' ? 'Confirmado' : schedule.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Local</p>
                        <p className="font-medium flex items-center gap-2">
                          {schedule.is_online ? <Video size={16} /> : <MapPin size={16} />}
                          {schedule.is_online ? 'Sessão Online' : schedule.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confirmação</p>
                        <p className="font-medium flex items-center gap-2">
                          {schedule.athlete_confirmed ? (
                            <>
                              <CheckCircle size={16} className="text-green-600" />
                              Confirmado pelo atleta
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} className="text-yellow-600" />
                              Aguardando confirmação
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {schedule.description && (
                    <div>
                      <h3 className="font-semibold mb-3">Descrição</h3>
                      <p className="text-gray-700">{schedule.description}</p>
                    </div>
                  )}

                  {schedule.workout_plan && (
                    <div>
                      <h3 className="font-semibold mb-3">Plano de Treino</h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{schedule.workout_plan.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Semana {schedule.workout_plan.week}, Dia {schedule.workout_plan.day}
                        </p>
                      </div>
                    </div>
                  )}

                  {schedule.notes && (
                    <div>
                      <h3 className="font-semibold mb-3">Observações</h3>
                      <p className="text-gray-700 p-4 bg-yellow-50 rounded-lg">
                        {schedule.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Histórico de Alterações</h3>
                  <div className="space-y-3">
                    {schedule.history.map((entry, index) => (
                      <div key={index} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <History size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {entry.action === 'created' && 'Agendamento criado'}
                              {entry.action === 'confirmed' && 'Sessão confirmada'}
                              {entry.action === 'reminder_sent' && 'Lembrete enviado'}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleString('pt-PT')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Por: {entry.user} {entry.note && `- ${entry.note}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Sessões Anteriores com este Atleta</h4>
                    <div className="space-y-2">
                      {schedule.previous_sessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="font-medium">
                              {new Date(session.date).toLocaleDateString('pt-PT')}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full bg-${
                              session.status === 'completed' ? 'green' : 'red'
                            }-100 text-${
                              session.status === 'completed' ? 'green' : 'red'
                            }-700`}>
                              {session.status === 'completed' ? 'Concluída' : 'Cancelada'}
                            </span>
                          </div>
                          {session.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < session.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Adicionar Nota</h3>
                    <div className="flex gap-2">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Escreva uma nota sobre esta sessão..."
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                      <button
                        onClick={handleAddNote}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Notas Anteriores</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Nota da sessão</span>
                          <span className="text-xs text-gray-500">20/01/2025 10:30</span>
                        </div>
                        <p className="text-sm text-gray-700">{schedule.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSendReminder}
                disabled={sendingReminder}
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {sendingReminder ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Bell size={18} />
                )}
                Enviar Lembrete
              </button>
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <RefreshCw size={18} />
                Reagendar
              </button>
              <button
                onClick={handleCompleteSession}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle size={18} />
                Marcar Concluída
              </button>
              <button
                onClick={handleCancelSession}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <XCircle size={18} />
                Cancelar Sessão
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Informações do Atleta</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {schedule.athlete.avatar ? (
                  <img 
                    src={schedule.athlete.avatar} 
                    alt={schedule.athlete.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{schedule.athlete.name}</p>
                  <p className="text-sm text-gray-600">{schedule.athlete.age} anos</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${schedule.athlete.email}`} className="text-blue-600 hover:text-blue-700">
                    {schedule.athlete.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${schedule.athlete.phone}`} className="text-blue-600 hover:text-blue-700">
                    {schedule.athlete.phone}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Membro desde</span>
                  <span className="font-medium">
                    {new Date(schedule.athlete.memberSince).toLocaleDateString('pt-PT')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de sessões</span>
                  <span className="font-medium">{schedule.athlete.totalSessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessões faltadas</span>
                  <span className="font-medium text-red-600">{schedule.athlete.missedSessions}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/athletes/${schedule.athlete.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ver Perfil Completo
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Informações de Pagamento</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  schedule.payment.status === 'paid' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {schedule.payment.status === 'paid' ? 'Pago' : 'Pendente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valor</span>
                <span className="font-medium">{schedule.payment.amount}€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Método</span>
                <span className="text-sm">{schedule.payment.method === 'monthly_plan' ? 'Plano Mensal' : 'Avulso'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessões restantes</span>
                <span className="font-medium">{schedule.payment.sessions_remaining}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <MessageSquare className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Comunicação</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Enviar mensagem ao atleta →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminação</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja eliminar este agendamento? Esta ação não pode ser revertida.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default ScheduleDetailView;