// src/modules/trainer/pages/AthleteDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Target,
  TrendingUp,
  Clock,
  Edit,
  MoreVertical,
  Dumbbell,
  Heart,
  Ruler,
  Weight,
  Award,
  AlertCircle,
  CheckCircle,
  FileText,
  BarChart3,
  Settings,
  Loader2,
  X,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Plus,
  History
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const AthleteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [athlete, setAthlete] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id && user?.id) {
      fetchAthleteData();
    }
  }, [id, user]);

  const fetchAthleteData = async () => {
    try {
      setLoading(true);

      console.log('🔍 Buscando atleta com ID:', id);
      console.log('👤 Trainer ID:', user.id);

      // 1. Primeiro, buscar o perfil do atleta diretamente
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError);
        
        // Se não encontrar o perfil, tentar buscar através do convite
        const { data: inviteData, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('trainer_id', user.id)
          .eq('accepted_by', id)
          .eq('status', 'accepted')
          .single();

        if (inviteError) {
          console.error('❌ Erro ao buscar convite:', inviteError);
          toast.error('Atleta não encontrado');
          navigate('/athletes');
          return;
        }

        // Se encontrou o convite mas não o perfil, usar dados do convite
        console.log('📧 Dados do convite encontrados:', inviteData);
      }

      console.log('✅ Perfil encontrado:', profileData);

      // 2. Buscar o convite para verificar a relação trainer-atleta
      const { data: inviteData, error: inviteCheckError } = await supabase
        .from('invites')
        .select('*')
        .eq('trainer_id', user.id)
        .eq('accepted_by', id)
        .eq('status', 'accepted')
        .single();

      if (inviteCheckError) {
        console.error('⚠️ Aviso: Convite não encontrado, mas perfil existe');
        // Continua mesmo sem o convite, pois o perfil existe
      }

      // 3. Processar dados do atleta
      const athleteProfile = profileData || {};
      const age = athleteProfile?.birth_date ? 
        new Date().getFullYear() - new Date(athleteProfile.birth_date).getFullYear() : null;

      const processedAthlete = {
        id: athleteProfile.id || id,
        name: athleteProfile.name || inviteData?.athlete_name || 'Nome não definido',
        email: athleteProfile.email || inviteData?.athlete_email || '',
        phone: athleteProfile.phone || '',
        avatar: athleteProfile.avatar_url,
        birthDate: athleteProfile.birth_date,
        age: age,
        height: athleteProfile.height,
        weight: athleteProfile.weight,
        goals: athleteProfile.goals || [],
        medicalConditions: athleteProfile.medical_conditions || [],
        emergencyContact: athleteProfile.emergency_contact,
        emergencyPhone: athleteProfile.emergency_phone,
        activityLevel: athleteProfile.activity_level,
        trainingExperience: athleteProfile.training_experience,
        preferences: athleteProfile.preferences || {},
        availability: athleteProfile.availability || [],
        setupComplete: athleteProfile.setup_complete || false,
        profileComplete: athleteProfile.profile_complete || false,
        joinedAt: inviteData?.accepted_at || athleteProfile.created_at,
        createdAt: athleteProfile.created_at,
        // Adicionar mais campos se existirem
        medications: athleteProfile.medications,
        allergies: athleteProfile.allergies,
        emergencyRelationship: athleteProfile.emergency_relationship,
        trainingFrequency: athleteProfile.training_frequency,
        preferredTrainingTime: athleteProfile.preferred_training_time,
        trainingLocation: athleteProfile.training_location,
        equipmentAvailable: athleteProfile.equipment_available || [],
        trainerNotes: athleteProfile.trainer_notes,
        occupation: athleteProfile.occupation,
        lifestyle: athleteProfile.lifestyle,
        sleepHours: athleteProfile.sleep_hours,
        stressLevel: athleteProfile.stress_level,
        hydration: athleteProfile.hydration
      };

      // 4. Buscar planos de treino do atleta
      const { data: plans, error: plansError } = await supabase
        .from('workout_plans')
        .select('*, workouts(*)')
        .eq('athlete_id', id)
        .order('created_at', { ascending: false });

      if (plansError) {
        console.error('⚠️ Erro ao buscar planos:', plansError);
      }

      // 5. Buscar histórico de treinos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: history, error: historyError } = await supabase
        .from('workout_logs')
        .select(`
          *,
          workout:workouts(name, type)
        `)
        .eq('athlete_id', id)
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (historyError) {
        console.error('⚠️ Erro ao buscar histórico:', historyError);
      }

      // 6. Buscar medidas/avaliações
      const { data: measurementsData, error: measurementsError } = await supabase
        .from('measurements')
        .select('*')
        .eq('athlete_id', id)
        .order('measured_at', { ascending: false })
        .limit(10);

      if (measurementsError) {
        console.error('⚠️ Erro ao buscar medidas:', measurementsError);
      }

      console.log('📊 Dados completos carregados:', {
        athlete: processedAthlete,
        plans: plans?.length || 0,
        history: history?.length || 0,
        measurements: measurementsData?.length || 0
      });

      setAthlete(processedAthlete);
      setWorkoutPlans(plans || []);
      setTrainingHistory(history || []);
      setMeasurements(measurementsData || []);

    } catch (error) {
      console.error('Erro geral:', error);
      toast.error('Erro ao carregar dados do atleta');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const calculateStats = () => {
    const stats = {
      totalWorkouts: trainingHistory.length,
      currentStreak: 0,
      avgWorkoutDuration: 0,
      completionRate: 0,
      activePlans: workoutPlans.filter(p => p.status === 'active').length,
      totalPlans: workoutPlans.length
    };

    if (trainingHistory.length > 0) {
      // Calcular média de duração
      const totalDuration = trainingHistory.reduce((acc, log) => acc + (log.duration || 0), 0);
      stats.avgWorkoutDuration = Math.round(totalDuration / trainingHistory.length);

      // Calcular taxa de conclusão (últimos 7 dias)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentLogs = trainingHistory.filter(log => new Date(log.completed_at) >= lastWeek);
      const completedLogs = recentLogs.filter(log => log.status === 'completed');
      stats.completionRate = recentLogs.length > 0 
        ? Math.round((completedLogs.length / recentLogs.length) * 100)
        : 0;
    }

    return stats;
  };

  // Componente de Tab
  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  // Componente de Card de Informação
  const InfoCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
    };

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{value || '-'}</p>
          </div>
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Atleta não encontrado</h3>
          <Link to="/athletes" className="text-blue-600 hover:text-blue-700">
            Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/athletes')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Perfil do Atleta</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/athletes/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar e Info Básica */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {athlete.avatar ? (
                  <img 
                    src={athlete.avatar} 
                    alt={athlete.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{athlete.name}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {athlete.email}
                  </div>
                  {athlete.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {athlete.phone}
                    </div>
                  )}
                  {athlete.age && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {athlete.age} anos
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status do Perfil */}
            <div className="flex-1 flex items-center justify-end">
              <div className="text-right">
                {athlete.profileComplete ? (
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Perfil Completo
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Perfil Incompleto
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Membro desde {new Date(athlete.joinedAt).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          <TabButton 
            id="overview" 
            label="Visão Geral" 
            icon={BarChart3} 
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="profile" 
            label="Perfil Completo" 
            icon={User} 
            isActive={activeTab === 'profile'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="plans" 
            label="Planos de Treino" 
            icon={ClipboardList} 
            isActive={activeTab === 'plans'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="history" 
            label="Histórico" 
            icon={History} 
            isActive={activeTab === 'history'}
            onClick={setActiveTab}
          />
          <TabButton 
            id="measurements" 
            label="Avaliações" 
            icon={Ruler} 
            isActive={activeTab === 'measurements'}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div>
        {/* Tab: Visão Geral */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InfoCard 
                icon={Dumbbell} 
                label="Treinos (30 dias)" 
                value={stats.totalWorkouts}
                color="blue"
              />
              <InfoCard 
                icon={Clock} 
                label="Duração Média" 
                value={`${stats.avgWorkoutDuration} min`}
                color="green"
              />
              <InfoCard 
                icon={TrendingUp} 
                label="Taxa de Conclusão" 
                value={`${stats.completionRate}%`}
                color="yellow"
              />
              <InfoCard 
                icon={FileText} 
                label="Planos Ativos" 
                value={`${stats.activePlans}/${stats.totalPlans}`}
                color="purple"
              />
            </div>

            {/* Objetivos */}
            {athlete.goals && athlete.goals.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Objetivos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {athlete.goals.map((goal, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Últimos Treinos */}
            {trainingHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Últimos Treinos
                </h3>
                <div className="space-y-3">
                  {trainingHistory.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.workout?.name || 'Treino'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.completed_at).toLocaleDateString('pt-PT')} • 
                          {log.duration ? ` ${log.duration} min` : ' Duração não registada'}
                        </p>
                      </div>
                      <div>
                        {log.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Perfil Completo */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Informações Físicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Físicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Altura</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.height ? `${athlete.height} cm` : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Peso</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.weight ? `${athlete.weight} kg` : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">IMC</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.height && athlete.weight 
                        ? (athlete.weight / Math.pow(athlete.height / 100, 2)).toFixed(1)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nível de Atividade */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiência e Nível</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nível de Atividade</label>
                    <p className="text-gray-900 font-medium capitalize">
                      {athlete.activityLevel || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Estilo de Vida</label>
                    <p className="text-gray-900 font-medium">
                      {athlete.lifestyle ? 
                        athlete.lifestyle === 'sedentary' ? 'Sedentário' :
                        athlete.lifestyle === 'moderate' ? 'Moderado' :
                        athlete.lifestyle === 'active' ? 'Ativo' :
                        athlete.lifestyle === 'very_active' ? 'Muito Ativo' :
                        athlete.lifestyle
                        : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hábitos de Vida */}
              {(athlete.sleepHours || athlete.stressLevel || athlete.hydration) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos de Vida</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {athlete.sleepHours && (
                      <div>
                        <label className="text-sm text-gray-600">Horas de Sono</label>
                        <p className="text-gray-900 font-medium">{athlete.sleepHours}</p>
                      </div>
                    )}
                    {athlete.stressLevel && (
                      <div>
                        <label className="text-sm text-gray-600">Nível de Stress</label>
                        <p className="text-gray-900 font-medium capitalize">
                          {athlete.stressLevel === 'low' ? 'Baixo' :
                           athlete.stressLevel === 'moderate' ? 'Moderado' :
                           athlete.stressLevel === 'high' ? 'Alto' :
                           athlete.stressLevel === 'very_high' ? 'Muito Alto' :
                           athlete.stressLevel}
                        </p>
                      </div>
                    )}
                    {athlete.hydration && (
                      <div>
                        <label className="text-sm text-gray-600">Hidratação Diária</label>
                        <p className="text-gray-900 font-medium">{athlete.hydration}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Condições Médicas */}
              {athlete.medicalConditions && athlete.medicalConditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Condições Médicas</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {athlete.medicalConditions.map((condition, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                          <span className="text-gray-900">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Contacto de Emergência */}
              {(athlete.emergencyContact || athlete.emergencyPhone) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergência</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {athlete.emergencyContact && (
                      <div>
                        <label className="text-sm text-gray-600">Nome</label>
                        <p className="text-gray-900 font-medium">
                          {athlete.emergencyContact}
                        </p>
                      </div>
                    )}
                    {athlete.emergencyPhone && (
                      <div>
                        <label className="text-sm text-gray-600">Telefone</label>
                        <p className="text-gray-900 font-medium">
                          {athlete.emergencyPhone}
                        </p>
                      </div>
                    )}
                    {athlete.emergencyRelationship && (
                      <div>
                        <label className="text-sm text-gray-600">Relação</label>
                        <p className="text-gray-900 font-medium">
                          {athlete.emergencyRelationship}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Disponibilidade e Preferências */}
              <div className="space-y-4">
                {/* Disponibilidade */}
                {athlete.availability && athlete.availability.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidade para Treinos</h3>
                    <div className="flex flex-wrap gap-2">
                      {athlete.availability.map((day, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferências de Treino */}
                {(athlete.preferredTrainingTime || athlete.trainingLocation || athlete.trainingFrequency) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Treino</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {athlete.preferredTrainingTime && (
                        <div>
                          <label className="text-sm text-gray-600">Horário Preferido</label>
                          <p className="text-gray-900 font-medium">
                            {athlete.preferredTrainingTime === 'morning' ? 'Manhã' :
                             athlete.preferredTrainingTime === 'afternoon' ? 'Tarde' :
                             athlete.preferredTrainingTime === 'evening' ? 'Noite' :
                             athlete.preferredTrainingTime === 'flexible' ? 'Flexível' :
                             athlete.preferredTrainingTime}
                          </p>
                        </div>
                      )}
                      {athlete.trainingLocation && (
                        <div>
                          <label className="text-sm text-gray-600">Local de Treino</label>
                          <p className="text-gray-900 font-medium">
                            {athlete.trainingLocation === 'gym' ? 'Ginásio' :
                             athlete.trainingLocation === 'home' ? 'Casa' :
                             athlete.trainingLocation === 'outdoor' ? 'Ar Livre' :
                             athlete.trainingLocation === 'studio' ? 'Estúdio/Box' :
                             athlete.trainingLocation === 'mixed' ? 'Vários Locais' :
                             athlete.trainingLocation}
                          </p>
                        </div>
                      )}
                      {athlete.trainingFrequency && (
                        <div>
                          <label className="text-sm text-gray-600">Frequência Desejada</label>
                          <p className="text-gray-900 font-medium">
                            {athlete.trainingFrequency === '7' ? 'Todos os dias' :
                             `${athlete.trainingFrequency} vezes por semana`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Equipamentos Disponíveis */}
                {athlete.equipmentAvailable && athlete.equipmentAvailable.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos Disponíveis</h3>
                    <div className="flex flex-wrap gap-2">
                      {athlete.equipmentAvailable.map((equipment, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notas do Trainer */}
              {athlete.trainerNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas do Trainer</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{athlete.trainerNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Planos de Treino */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            {workoutPlans.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sem planos de treino
                </h3>
                <p className="text-gray-600 mb-6">
                  Este atleta ainda não tem planos de treino atribuídos
                </p>
                <Link
                  to={`/workout-plans/new?athlete=${id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Plano de Treino
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Planos de Treino</h3>
                  <Link
                    to={`/workout-plans/new?athlete=${id}`}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Plano
                  </Link>
                </div>
                {workoutPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {plan.workouts?.length || 0} treinos
                          </span>
                          <span className="text-sm text-gray-500">
                            Criado em {new Date(plan.created_at).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/workout-plans/${plan.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {trainingHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sem histórico de treinos
                </h3>
                <p className="text-gray-600">
                  Os treinos realizados aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Histórico de Treinos (Últimos 30 dias)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Treino
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duração
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {trainingHistory.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(log.completed_at).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {log.workout?.name || 'Treino'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {log.duration ? `${log.duration} min` : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status === 'completed' ? 'Completo' : 'Parcial'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {log.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Avaliações */}
        {activeTab === 'measurements' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {measurements.length === 0 ? (
              <div className="text-center py-12">
                <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sem avaliações registadas
                </h3>
                <p className="text-gray-600 mb-6">
                  Registe avaliações para acompanhar o progresso
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Avaliação
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Avaliações Físicas</h3>
                  <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Avaliação
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peso (kg)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Gordura
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Massa Muscular
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IMC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {measurements.map((measurement) => (
                        <tr key={measurement.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(measurement.measured_at).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {measurement.weight || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {measurement.body_fat ? `${measurement.body_fat}%` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {measurement.muscle_mass ? `${measurement.muscle_mass} kg` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {measurement.bmi || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteDetails;