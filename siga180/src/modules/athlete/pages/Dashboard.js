// src/modules/athlete/pages/Dashboard.js
import React, { useState } from 'react';
import Layout from '../../shared/components/layout/Layout';
import { 
  Calendar, 
  Activity, 
  Apple, 
  TrendingUp,
  Clock,
  Target,
  Award,
  AlertCircle,
  ChevronRight,
  Dumbbell,
  Heart,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Componente para Card de Estatística
const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// Componente para Sessão de Treino
const WorkoutSessionCard = ({ session, onStart }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Dumbbell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{session.name}</h4>
            <p className="text-sm text-gray-600">{session.time}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
          {session.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{session.duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Target className="w-4 h-4 mr-2" />
          <span>{session.focus}</span>
        </div>
      </div>

      {session.status === 'upcoming' && (
        <button 
          onClick={() => onStart(session)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Começar Treino</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Componente de Progresso Rápido
const QuickProgress = ({ title, current, goal, unit, icon: Icon }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <span className="text-sm text-gray-600">
          {current}/{goal} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const AthleteDashboard = () => {
  const [todayWorkouts] = useState([
    {
      id: 1,
      name: 'Treino de Pernas',
      time: '18:00 - 19:00',
      duration: '60 min',
      focus: 'Força e Resistência',
      status: 'upcoming'
    },
    {
      id: 2,
      name: 'Cardio HIIT',
      time: '07:00 - 07:30',
      duration: '30 min',
      focus: 'Condicionamento',
      status: 'completed'
    }
  ]);

  const [weeklyProgress] = useState([
    { day: 'S', completed: true, workout: 'Peito' },
    { day: 'T', completed: true, workout: 'Costas' },
    { day: 'Q', completed: false, workout: 'Pernas' },
    { day: 'Q', completed: true, workout: 'Ombros' },
    { day: 'S', completed: false, workout: 'Cardio' },
    { day: 'S', completed: false, workout: 'Full Body' },
    { day: 'D', completed: false, workout: 'Rest' }
  ]);

  const [recentAchievements] = useState([
    { id: 1, title: '7 Dias Consecutivos', icon: Award, date: 'Há 2 dias' },
    { id: 2, title: 'Novo PR no Supino', icon: TrendingUp, date: 'Há 5 dias' },
    { id: 3, title: 'Meta de Calorias', icon: Apple, date: 'Há 1 semana' }
  ]);

  const handleStartWorkout = (session) => {
    console.log('Starting workout:', session);
    // Navegar para página de treino
  };

  return (
    
      <div className="p-6">
        {/* Header com Saudação */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Olá, Maria! 👋</h1>
          <p className="text-gray-600 mt-1">Pronta para mais um dia de conquistas?</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Calendar}
            title="Próximo Treino"
            value="Hoje, 18:00"
            subtitle="Treino de Pernas"
            color="blue"
          />
          <StatsCard
            icon={Activity}
            title="Esta Semana"
            value="4/6"
            subtitle="Treinos completos"
            color="green"
            trend={15}
          />
          <StatsCard
            icon={Heart}
            title="Frequência Cardíaca"
            value="72 bpm"
            subtitle="Média em repouso"
            color="red"
          />
          <StatsCard
            icon={Zap}
            title="Calorias Hoje"
            value="1,850"
            subtitle="Meta: 2,200 kcal"
            color="orange"
            trend={-8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sessões de Hoje */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Treinos de Hoje</h2>
                <Link to="/workouts" className="text-sm text-blue-600 hover:text-blue-700">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                {todayWorkouts.map(session => (
                  <WorkoutSessionCard
                    key={session.id}
                    session={session}
                    onStart={handleStartWorkout}
                  />
                ))}
              </div>
            </div>

            {/* Progresso Semanal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progresso Semanal</h2>
              <div className="flex justify-between mb-6">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      day.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {day.completed ? '✓' : day.day}
                    </div>
                    <p className="text-xs text-gray-600">{day.day}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <QuickProgress
                  title="Treinos Completos"
                  current={4}
                  goal={6}
                  unit="treinos"
                  icon={Dumbbell}
                />
                <QuickProgress
                  title="Calorias Queimadas"
                  current={2150}
                  goal={3000}
                  unit="kcal"
                  icon={Activity}
                />
                <QuickProgress
                  title="Tempo de Exercício"
                  current={240}
                  goal={300}
                  unit="min"
                  icon={Clock}
                />
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Check-in Rápido */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-in Diário</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Ainda não fez check-in</span>
                  </div>
                </div>
                <Link 
                  to="/checkin"
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fazer Check-in
                </Link>
              </div>
            </div>

            {/* Conquistas Recentes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conquistas Recentes</h3>
              <div className="space-y-3">
                {recentAchievements.map(achievement => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Icon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nutrição Rápida */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrição Hoje</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">1,850</div>
                  <p className="text-sm text-gray-600">de 2,200 kcal</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proteínas</span>
                    <span className="font-medium">78g / 120g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Carboidratos</span>
                    <span className="font-medium">215g / 250g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gorduras</span>
                    <span className="font-medium">62g / 70g</span>
                  </div>
                </div>
                
                <Link 
                  to="/nutrition"
                  className="block w-full text-center text-blue-600 text-sm hover:text-blue-700"
                >
                  Ver detalhes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default AthleteDashboard;