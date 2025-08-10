// siga180/src/modules/trainer/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  Plus,
  Activity,
  Target,
  Award,
  ChevronRight,
  UserPlus,
  Dumbbell,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { useAthletes } from '../hooks/useAthletes';
import toast from 'react-hot-toast';

// Card de Estatística Moderna
const StatsCard = ({ icon: Icon, label, value, trend, color }) => {
  const colorClasses = {
    olive: 'bg-[#E8ECE3] text-[#333333]',
    dark: 'bg-[#333333] text-white',
    accent: 'bg-gradient-to-br from-[#333333] to-gray-700 text-white'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.olive}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-[#333333]">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

// Card de Sessão Hoje
const TodaySessionCard = ({ session, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-[#E8ECE3] bg-opacity-30 rounded-lg hover:bg-opacity-50 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center font-semibold">
          {session.athlete.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-[#333333]">{session.athlete.name}</p>
          <p className="text-sm text-gray-600">{session.type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[#333333]">{session.time}</p>
        <p className="text-xs text-gray-500">{session.duration}</p>
      </div>
    </div>
  );
};

// Card de Atleta Recente
const RecentAthleteCard = ({ athlete, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3 hover:bg-[#E8ECE3] hover:bg-opacity-20 rounded-lg cursor-pointer transition-all"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#333333] to-gray-600 text-white flex items-center justify-center text-sm font-semibold">
          {athlete.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-[#333333]">{athlete.name}</p>
          <p className="text-xs text-gray-500">Aderiu {athlete.joinedAt}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { athletes, loading, stats } = useAthletes();
  const [todaySessions, setTodaySessions] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    // Simular sessões de hoje (em produção, buscar do Supabase)
    const mockSessions = athletes.slice(0, 3).map((athlete, index) => ({
      id: index + 1,
      athlete: athlete,
      time: `${14 + index}:00`,
      duration: '1h',
      type: ['Treino de Força', 'Cardio', 'Funcional'][index % 3]
    }));
    setTodaySessions(mockSessions);

    // Calcular progresso semanal
    setWeeklyProgress(12); // Em produção, calcular baseado em dados reais
  }, [athletes]);

  const handleNewAthlete = () => {
    navigate('/athletes/new');
  };

  const handleViewAthletes = () => {
    navigate('/athletes');
  };

  const handleAthleteClick = (athlete) => {
    navigate(`/athletes/${athlete.id}`);
  };

  const handleSessionClick = (session) => {
    navigate(`/athletes/${session.athlete.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#333333]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">
          Olá, {user?.name || 'Trainer'} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {new Date().toLocaleDateString('pt-PT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Users} 
          label="Total de Atletas" 
          value={stats.total}
          color="dark"
        />
        <StatsCard 
          icon={Activity} 
          label="Atletas Ativos" 
          value={stats.active}
          trend={weeklyProgress}
          color="olive"
        />
        <StatsCard 
          icon={Target} 
          label="Sessões Hoje" 
          value={todaySessions.length}
          color="accent"
        />
        <StatsCard 
          icon={Award} 
          label="Novos Este Mês" 
          value={stats.newThisMonth}
          trend={8}
          color="olive"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessões de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#333333]">Sessões de Hoje</h2>
            <button className="text-sm text-gray-600 hover:text-[#333333] transition-colors">
              Ver todas →
            </button>
          </div>
          
          {todaySessions.length > 0 ? (
            <div className="space-y-3">
              {todaySessions.map(session => (
                <TodaySessionCard 
                  key={session.id}
                  session={session}
                  onClick={handleSessionClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Sem sessões agendadas para hoje</p>
            </div>
          )}
        </div>

        {/* Atletas Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#333333]">Atletas</h2>
            <button 
              onClick={handleViewAthletes}
              className="text-sm text-gray-600 hover:text-[#333333] transition-colors"
            >
              Ver todos →
            </button>
          </div>

          {athletes.length > 0 ? (
            <>
              <div className="space-y-2 mb-6">
                {athletes.slice(0, 5).map(athlete => (
                  <RecentAthleteCard 
                    key={athlete.id}
                    athlete={athlete}
                    onClick={() => handleAthleteClick(athlete)}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNewAthlete}
                className="w-full py-3 bg-[#333333] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar Novo Atleta</span>
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Ainda sem atletas</p>
              <button
                onClick={handleNewAthlete}
                className="px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Primeiro Atleta</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <button
          onClick={() => navigate('/workouts')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8ECE3] rounded-lg">
              <Dumbbell className="h-5 w-5 text-[#333333]" />
            </div>
            <span className="font-medium text-[#333333]">Criar Treino</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#333333] transition-colors" />
        </button>

        <button
          onClick={() => navigate('/nutrition')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8ECE3] rounded-lg">
              <Target className="h-5 w-5 text-[#333333]" />
            </div>
            <span className="font-medium text-[#333333]">Planos Nutrição</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#333333] transition-colors" />
        </button>

        <button
          onClick={() => navigate('/analytics')}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8ECE3] rounded-lg">
              <BarChart3 className="h-5 w-5 text-[#333333]" />
            </div>
            <span className="font-medium text-[#333333]">Análises</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#333333] transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;