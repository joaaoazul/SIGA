import React, { useState, useEffect } from 'react';
import { 
  Apple, 
  Search, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Save,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Users,
  FileText,
  Copy,
  Send,
  Eye,
  Download,
  Clock,
  CheckCircle,
  User,
  Activity,
  Settings,
  Filter,
  MoreVertical,
  Zap,
  Award,
  Camera,
  MessageSquare,
  Bell,
  BellOff,
  Smartphone,
  Mail,
  Database,
  Calculator,
  BookOpen,
  Share2,
  PieChart,
  LineChart,
  Info,
  Star,
  Shield,
  Utensils,
  Cookie,
  Droplets,
  Flame,
  Heart,
  Brain,
  ChevronDown,
  Upload,
  Loader2,
  Coffee,
  Pizza,
  Salad,
  Fish,
  Egg,
  Milk,
  Wheat,
  Soup,
  Scale,
  Package,
  Timer,
  ShoppingCart,
  BarChart,
  ListPlus,
  Percent,
  RefreshCw,
  HelpCircle,
  History,
  Scan,
  CreditCard,
  Layers,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Componente Principal - Nutrição para Personal Trainer
const NutritionPageTrainer = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAthleteDetail, setShowAthleteDetail] = useState(false);
  const [showFoodDatabase, setShowFoodDatabase] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  // Mock data de atletas com mais detalhes
  const [athletes] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '+351 912 345 678',
      avatar: null,
      age: 28,
      weight: 75,
      height: 178,
      activityLevel: 'moderate',
      goal: 'Perder gordura',
      tags: ['Cutting', 'Gym 5x'],
      nutritionPlan: {
        id: 'plan-1',
        name: 'Plano de Cutting Progressivo',
        type: 'cutting',
        calories: 2400,
        protein: 180,
        carbs: 240,
        fat: 80,
        fiber: 35,
        water: 3000,
        startDate: '2024-01-15',
        endDate: '2024-03-15',
        lastUpdate: '2024-01-26',
        weeklyCheckIn: true,
        mealPlan: 'flexible',
        supplements: ['Whey', 'Creatina', 'Multivitamínico'],
        restrictions: ['Lactose'],
        progress: {
          weightChange: -2.5,
          bodyFatChange: -1.2,
          muscleMassChange: +0.3,
          measurements: {
            waist: -3,
            chest: -1,
            arms: 0
          }
        },
        compliance: {
          overall: 85,
          calories: 88,
          protein: 95,
          carbs: 82,
          fat: 78,
          water: 72
        },
        recentMeals: [
          { date: '2024-01-26', compliance: 92 },
          { date: '2024-01-25', compliance: 85 },
          { date: '2024-01-24', compliance: 88 },
          { date: '2024-01-23', compliance: 79 },
          { date: '2024-01-22', compliance: 91 }
        ]
      },
      notifications: {
        email: true,
        sms: false,
        app: true
      },
      lastActivity: '2 horas atrás',
      streak: 12
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '+351 913 456 789',
      avatar: null,
      age: 25,
      weight: 58,
      height: 165,
      activityLevel: 'high',
      goal: 'Ganhar massa muscular',
      tags: ['Bulking', 'Crossfit'],
      nutritionPlan: {
        id: 'plan-2',
        name: 'Plano de Bulking Limpo',
        type: 'bulking',
        calories: 2200,
        protein: 110,
        carbs: 280,
        fat: 70,
        fiber: 30,
        water: 2500,
        startDate: '2024-01-10',
        endDate: '2024-04-10',
        lastUpdate: '2024-01-25',
        weeklyCheckIn: true,
        mealPlan: 'structured',
        supplements: ['Whey', 'Gainers'],
        restrictions: [],
        progress: {
          weightChange: +1.2,
          bodyFatChange: +0.5,
          muscleMassChange: +0.7,
          measurements: {
            waist: +1,
            chest: +2,
            arms: +1.5
          }
        },
        compliance: {
          overall: 92,
          calories: 94,
          protein: 98,
          carbs: 90,
          fat: 88,
          water: 85
        },
        recentMeals: [
          { date: '2024-01-25', compliance: 95 },
          { date: '2024-01-24', compliance: 92 },
          { date: '2024-01-23', compliance: 88 },
          { date: '2024-01-22', compliance: 94 },
          { date: '2024-01-21', compliance: 91 }
        ]
      },
      notifications: {
        email: true,
        sms: true,
        app: true
      },
      lastActivity: '1 dia atrás',
      streak: 21
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      phone: '+351 914 567 890',
      avatar: null,
      age: 35,
      weight: 82,
      height: 175,
      activityLevel: 'low',
      goal: 'Manter peso',
      tags: ['Manutenção', 'Iniciante'],
      nutritionPlan: null,
      notifications: {
        email: true,
        sms: false,
        app: false
      },
      lastActivity: '5 dias atrás',
      streak: 0
    }
  ]);

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'active' && athlete.nutritionPlan) ||
                         (filterType === 'inactive' && !athlete.nutritionPlan) ||
                         (filterType === 'attention' && athlete.nutritionPlan?.compliance.overall < 80);
    return matchesSearch && matchesFilter;
  });

  // Estatísticas gerais
  const stats = {
    totalAthletes: athletes.length,
    activeAthletes: athletes.filter(a => a.nutritionPlan).length,
    avgCompliance: Math.round(
      athletes
        .filter(a => a.nutritionPlan)
        .reduce((acc, a) => acc + a.nutritionPlan.compliance.overall, 0) / 
      athletes.filter(a => a.nutritionPlan).length || 0
    ),
    needsAttention: athletes.filter(a => a.nutritionPlan?.compliance.overall < 80).length,
    totalStreak: athletes.reduce((acc, a) => acc + a.streak, 0),
    avgWeightChange: (
      athletes
        .filter(a => a.nutritionPlan?.progress.weightChange)
        .reduce((acc, a) => acc + a.nutritionPlan.progress.weightChange, 0) / 
      athletes.filter(a => a.nutritionPlan).length || 0
    ).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Central de Nutrição</h1>
            <p className="text-gray-600">Gestão completa de planos nutricionais</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowFoodDatabase(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" 
              title="Base de Dados"
            >
              <Database className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setActiveView('tools')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" 
              title="Calculadoras"
            >
              <Calculator className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Recursos">
              <BookOpen className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowCreatePlan(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Plano
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.totalAthletes}</p>
            <p className="text-sm text-gray-600">Total Atletas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.activeAthletes}</p>
            <p className="text-sm text-gray-600">Planos Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.avgCompliance}%</p>
            <p className="text-sm text-gray-600">Aderência Média</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.needsAttention}</p>
            <p className="text-sm text-gray-600">Precisam Atenção</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalStreak}</p>
            <p className="text-sm text-gray-600">Dias Totais</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.avgWeightChange}kg</p>
            <p className="text-sm text-gray-600">Média Peso</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('athletes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'athletes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Atletas
            </button>
            <button
              onClick={() => setActiveView('plans')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Planos
            </button>
            <button
              onClick={() => setActiveView('meals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'meals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Utensils className="h-4 w-4 inline mr-2" />
              Refeições
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LineChart className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveView('database')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'database'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database className="h-4 w-4 inline mr-2" />
              Base de Dados
            </button>
            <button
              onClick={() => setActiveView('tools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'tools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="h-4 w-4 inline mr-2" />
              Ferramentas
            </button>
          </nav>
        </div>
      </div>

      {/* Content Views */}
      {activeView === 'dashboard' && (
        <DashboardView athletes={athletes} dateRange={dateRange} setDateRange={setDateRange} />
      )}

      {activeView === 'athletes' && (
        <AthletesView 
          athletes={filteredAthletes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          onSelectAthlete={(athlete) => {
            setSelectedAthlete(athlete);
            setShowAthleteDetail(true);
          }}
          onCreatePlan={() => setShowCreatePlan(true)}
        />
      )}

      {activeView === 'plans' && (
        <PlansView athletes={athletes} onCreatePlan={() => setShowCreatePlan(true)} />
      )}

      {activeView === 'meals' && (
        <MealsView athletes={athletes} />
      )}

      {activeView === 'analytics' && (
        <AnalyticsView athletes={athletes} />
      )}

      {activeView === 'database' && (
        <DatabaseView />
      )}

      {activeView === 'tools' && (
        <ToolsView />
      )}

      {/* Modals */}
      {showCreatePlan && (
        <CreatePlanModal 
          onClose={() => setShowCreatePlan(false)}
          selectedAthlete={selectedAthlete}
          athletes={athletes}
        />
      )}

      {showAthleteDetail && selectedAthlete && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          onClose={() => {
            setShowAthleteDetail(false);
            setSelectedAthlete(null);
          }}
        />
      )}

      {showFoodDatabase && (
        <FoodDatabaseModal onClose={() => setShowFoodDatabase(false)} />
      )}
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ athletes, dateRange, setDateRange }) => {
  // Dados para gráficos
  const complianceData = athletes
    .filter(a => a.nutritionPlan)
    .map(a => ({
      name: a.name.split(' ')[0],
      compliance: a.nutritionPlan.compliance.overall
    }));

  const progressData = athletes
    .filter(a => a.nutritionPlan)
    .map(a => ({
      name: a.name.split(' ')[0],
      weight: a.nutritionPlan.progress.weightChange,
      muscle: a.nutritionPlan.progress.muscleMassChange,
      fat: a.nutritionPlan.progress.bodyFatChange
    }));

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Visão Geral</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDateRange('day')}
              className={`px-3 py-1 rounded ${dateRange === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Hoje
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1 rounded ${dateRange === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Semana
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1 rounded ${dateRange === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
          </div>
          <div className="p-6 space-y-4">
            {athletes
              .filter(a => a.nutritionPlan)
              .sort((a, b) => new Date(b.nutritionPlan.lastUpdate) - new Date(a.nutritionPlan.lastUpdate))
              .slice(0, 5)
              .map(athlete => (
                <div key={athlete.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{athlete.name}</p>
                      <p className="text-sm text-gray-500">Check-in • {athlete.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        athlete.nutritionPlan.compliance.overall >= 90 
                          ? 'bg-green-100 text-green-700' 
                          : athlete.nutritionPlan.compliance.overall >= 80
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {athlete.nutritionPlan.compliance.overall}% hoje
                      </span>
                      {athlete.streak > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <Flame className="h-3 w-3 mr-1" />
                          {athlete.streak} dias
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                      {athlete.nutritionPlan.progress.weightChange}kg
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Alertas</h3>
            <div className="space-y-3">
              {athletes
                .filter(a => a.nutritionPlan?.compliance.overall < 80)
                .map(athlete => (
                  <div key={athlete.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">{athlete.name}</p>
                      <p className="text-xs text-red-700">
                        Aderência baixa: {athlete.nutritionPlan.compliance.overall}%
                      </p>
                    </div>
                  </div>
                ))}
              {athletes.filter(a => a.nutritionPlan?.compliance.overall < 80).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Sem alertas no momento
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resumo Rápido</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Check-ins Hoje</span>
                <span className="font-semibold">12/15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mensagens Pendentes</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Planos a Expirar</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Novos Resultados</span>
                <span className="font-semibold text-green-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Aderência por Atleta</h3>
          <div className="space-y-3">
            {complianceData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-20">{data.name}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${
                        data.compliance >= 90 ? 'bg-green-500' :
                        data.compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${data.compliance}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {data.compliance}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Progresso dos Atletas</h3>
          <div className="space-y-4">
            {progressData.map((data, index) => (
              <div key={index} className="border rounded-lg p-3">
                <p className="font-medium text-gray-900 mb-2">{data.name}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Peso</p>
                    <p className={`font-semibold ${data.weight < 0 ? 'text-green-600' : 'text-blue-600'}`}>
                      {data.weight > 0 ? '+' : ''}{data.weight}kg
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Músculo</p>
                    <p className={`font-semibold ${data.muscle > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.muscle > 0 ? '+' : ''}{data.muscle}kg
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Gordura</p>
                    <p className={`font-semibold ${data.fat < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.fat > 0 ? '+' : ''}{data.fat}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Athletes View Component
const AthletesView = ({ athletes, searchTerm, setSearchTerm, filterType, setFilterType, onSelectAthlete, onCreatePlan }) => {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name');

  const sortedAthletes = [...athletes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'compliance':
        return (b.nutritionPlan?.compliance.overall || 0) - (a.nutritionPlan?.compliance.overall || 0);
      case 'activity':
        return new Date(b.nutritionPlan?.lastUpdate || 0) - new Date(a.nutritionPlan?.lastUpdate || 0);
      case 'progress':
        return Math.abs(b.nutritionPlan?.progress.weightChange || 0) - Math.abs(a.nutritionPlan?.progress.weightChange || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar atletas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Com Plano</option>
              <option value="inactive">Sem Plano</option>
              <option value="attention">Precisam Atenção</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nome</option>
              <option value="compliance">Aderência</option>
              <option value="activity">Atividade</option>
              <option value="progress">Progresso</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <Users className="h-4 w-4" />
              </button>
            </div>

            {/* Add Athlete Button */}
            <button
              onClick={onCreatePlan}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Athletes Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAthletes.map(athlete => (
            <AthleteCard 
              key={athlete.id} 
              athlete={athlete} 
              onSelect={() => onSelectAthlete(athlete)}
              onCreatePlan={onCreatePlan}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atleta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aderência
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAthletes.map(athlete => (
                <tr key={athlete.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                        <div className="text-sm text-gray-500">{athlete.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {athlete.nutritionPlan ? (
                      <div>
                        <div className="text-sm text-gray-900">{athlete.nutritionPlan.name}</div>
                        <div className="text-sm text-gray-500">{athlete.nutritionPlan.calories} kcal</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Sem plano</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {athlete.nutritionPlan ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        athlete.nutritionPlan.compliance.overall >= 90 
                          ? 'bg-green-100 text-green-800' 
                          : athlete.nutritionPlan.compliance.overall >= 80
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {athlete.nutritionPlan.compliance.overall}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {athlete.nutritionPlan ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span className={`text-sm font-medium ${
                          athlete.nutritionPlan.progress.weightChange < 0 
                            ? 'text-green-600' 
                            : 'text-blue-600'
                        }`}>
                          {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                          {athlete.nutritionPlan.progress.weightChange}kg
                        </span>
                        {athlete.nutritionPlan.progress.weightChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {athlete.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onSelectAthlete(athlete)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Ver
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Athlete Card Component
const AthleteCard = ({ athlete, onSelect, onCreatePlan }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              {athlete.avatar ? (
                <img src={athlete.avatar} alt={athlete.name} className="h-12 w-12 rounded-full" />
              ) : (
                <User className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{athlete.name}</h3>
              <p className="text-sm text-gray-500">{athlete.goal}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {athlete.tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
          {athlete.streak > 7 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              <Flame className="h-3 w-3 mr-1" />
              {athlete.streak} dias
            </span>
          )}
        </div>

        {athlete.nutritionPlan ? (
          <div className="space-y-4">
            {/* Plan Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{athlete.nutritionPlan.name}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  athlete.nutritionPlan.compliance.overall >= 90 
                    ? 'bg-green-100 text-green-800' 
                    : athlete.nutritionPlan.compliance.overall >= 80
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {athlete.nutritionPlan.compliance.overall}%
                </span>
              </div>
              
              {/* Macros Grid */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-gray-500">Cal</p>
                  <p className="font-semibold">{athlete.nutritionPlan.calories}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">P</p>
                  <p className="font-semibold">{athlete.nutritionPlan.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">C</p>
                  <p className="font-semibold">{athlete.nutritionPlan.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">G</p>
                  <p className="font-semibold">{athlete.nutritionPlan.fat}g</p>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Peso</p>
                <p className={`text-sm font-semibold ${
                  athlete.nutritionPlan.progress.weightChange < 0 
                    ? 'text-green-600' 
                    : 'text-blue-600'
                }`}>
                  {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                  {athlete.nutritionPlan.progress.weightChange}kg
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gordura</p>
                <p className={`text-sm font-semibold ${
                  athlete.nutritionPlan.progress.bodyFatChange < 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {athlete.nutritionPlan.progress.bodyFatChange > 0 ? '+' : ''}
                  {athlete.nutritionPlan.progress.bodyFatChange}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Músculo</p>
                <p className={`text-sm font-semibold ${
                  athlete.nutritionPlan.progress.muscleMassChange > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {athlete.nutritionPlan.progress.muscleMassChange > 0 ? '+' : ''}
                  {athlete.nutritionPlan.progress.muscleMassChange}kg
                </p>
              </div>
            </div>

            {/* Compliance Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Proteína</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${athlete.nutritionPlan.compliance.protein}%` }} />
                  </div>
                  <span className="font-medium">{athlete.nutritionPlan.compliance.protein}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Carboidratos</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${athlete.nutritionPlan.compliance.carbs}%` }} />
                  </div>
                  <span className="font-medium">{athlete.nutritionPlan.compliance.carbs}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Gordura</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${athlete.nutritionPlan.compliance.fat}%` }} />
                  </div>
                  <span className="font-medium">{athlete.nutritionPlan.compliance.fat}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Água</span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${athlete.nutritionPlan.compliance.water}%` }} />
                  </div>
                  <span className="font-medium">{athlete.nutritionPlan.compliance.water}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={onSelect}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Ver Detalhes
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Mensagem
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">Sem plano nutricional</p>
            <button
              onClick={() => {
                onCreatePlan();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Criar Plano
            </button>
          </div>
        )}

        {/* Last Activity */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
          <span>Última atividade: {athlete.lastActivity}</span>
          <div className="flex items-center space-x-2">
            {athlete.notifications.app && <Smartphone className="h-3 w-3" />}
            {athlete.notifications.email && <Mail className="h-3 w-3" />}
            {athlete.notifications.sms && <MessageSquare className="h-3 w-3" />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Plans View Component  
const PlansView = ({ athletes, onCreatePlan }) => {
  const activePlans = athletes
    .filter(a => a.nutritionPlan)
    .map(a => ({
      ...a.nutritionPlan,
      athleteName: a.name,
      athleteId: a.id,
      athleteGoal: a.goal
    }));

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold text-gray-900">Planos Ativos ({activePlans.length})</h3>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4 inline mr-1" />
                Filtrar
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                <Download className="h-4 w-4 inline mr-1" />
                Exportar
              </button>
            </div>
          </div>
          <button
            onClick={onCreatePlan}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Plano
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activePlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                  <p className="text-sm text-gray-500">{plan.athleteName} • {plan.athleteGoal}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    plan.type === 'cutting' ? 'bg-red-100 text-red-700' :
                    plan.type === 'bulking' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {plan.type}
                  </span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Período</p>
                  <p className="text-sm font-medium">
                    {new Date(plan.startDate).toLocaleDateString('pt-PT')} - {new Date(plan.endDate).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo de Refeições</p>
                  <p className="text-sm font-medium capitalize">{plan.mealPlan}</p>
                </div>
              </div>

              {/* Macros Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Calorias</p>
                    <p className="text-lg font-bold text-blue-600">{plan.calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Proteína</p>
                    <p className="text-lg font-bold text-green-600">{plan.protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Carbs</p>
                    <p className="text-lg font-bold text-orange-600">{plan.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Gordura</p>
                    <p className="text-lg font-bold text-yellow-600">{plan.fat}g</p>
                  </div>
                </div>
              </div>

              {/* Supplements & Restrictions */}
              <div className="space-y-2 mb-4">
                {plan.supplements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Suplementos:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.supplements.map((supp, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                          {supp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {plan.restrictions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Restrições:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.restrictions.map((rest, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
                          {rest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Atualizado {new Date(plan.lastUpdate).toLocaleDateString('pt-PT')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Templates Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Templates Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Cutting Agressivo', icon: Zap, color: 'red' },
            { name: 'Bulking Limpo', icon: TrendingUp, color: 'blue' },
            { name: 'Recomposição', icon: Activity, color: 'purple' },
            { name: 'Manutenção', icon: Shield, color: 'green' }
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <button
                key={index}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-center"
              >
                <Icon className={`h-8 w-8 mx-auto mb-2 text-${template.color}-600`} />
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Meals View Component - Novo!
const MealsView = ({ athletes }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealFilter, setMealFilter] = useState('all');
  const [showCreateMeal, setShowCreateMeal] = useState(false);

  // Mock data de refeições
  const mockMeals = [
    {
      id: 1,
      athleteName: 'João Silva',
      athleteId: 1,
      date: '2024-01-26',
      meals: [
        {
          type: 'breakfast',
          time: '08:00',
          foods: [
            { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
            { name: 'Banana', quantity: 1, unit: 'unidade', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
            { name: 'Whey Protein', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1.5 }
          ],
          totals: { calories: 614, protein: 42.2, carbs: 96.3, fat: 8.8 },
          notes: 'Pré-treino',
          photo: null
        },
        {
          type: 'lunch',
          time: '13:00',
          foods: [
            { name: 'Peito de Frango', quantity: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7.2 },
            { name: 'Arroz Integral', quantity: 150, unit: 'g', calories: 165, protein: 3.5, carbs: 34.5, fat: 1.2 },
            { name: 'Brócolos', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
          ],
          totals: { calories: 529, protein: 68.3, carbs: 41.5, fat: 8.8 },
          notes: 'Refeição pós-treino',
          photo: null
        }
      ],
      dailyTotals: { calories: 1843, protein: 165.5, carbs: 201.8, fat: 35.6 },
      compliance: 92,
      water: 2.5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold text-gray-900">Diários Alimentares</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium">{selectedDate.toLocaleDateString('pt-PT')}</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas Refeições</option>
              <option value="breakfast">Pequeno-almoço</option>
              <option value="lunch">Almoço</option>
              <option value="snack">Lanche</option>
              <option value="dinner">Jantar</option>
            </select>
            <button
              onClick={() => setShowCreateMeal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Registar Refeição
            </button>
          </div>
        </div>
      </div>

      {/* Meals Timeline */}
      <div className="space-y-6">
        {mockMeals.map(athleteMeals => (
          <div key={athleteMeals.id} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{athleteMeals.athleteName}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>Consumido: {athleteMeals.dailyTotals.calories} kcal</span>
                    <span>Aderência: {athleteMeals.compliance}%</span>
                    <span>Água: {athleteMeals.water}L</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Daily Macros Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{athleteMeals.dailyTotals.calories}</p>
                  <p className="text-sm text-gray-600">Calorias</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{athleteMeals.dailyTotals.protein}g</p>
                  <p className="text-sm text-gray-600">Proteína</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{athleteMeals.dailyTotals.carbs}g</p>
                  <p className="text-sm text-gray-600">Carboidratos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{athleteMeals.dailyTotals.fat}g</p>
                  <p className="text-sm text-gray-600">Gordura</p>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                {athleteMeals.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {meal.type === 'breakfast' && <Coffee className="h-5 w-5 text-orange-500" />}
                        {meal.type === 'lunch' && <Soup className="h-5 w-5 text-blue-500" />}
                        {meal.type === 'snack' && <Cookie className="h-5 w-5 text-purple-500" />}
                        {meal.type === 'dinner' && <Utensils className="h-5 w-5 text-green-500" />}
                        <div>
                          <p className="font-medium capitalize">{meal.type === 'breakfast' ? 'Pequeno-almoço' : meal.type}</p>
                          <p className="text-sm text-gray-500">{meal.time}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {meal.totals.calories} kcal
                      </div>
                    </div>
                    
                    {/* Foods List */}
                    <div className="space-y-2">
                      {meal.foods.map((food, foodIndex) => (
                        <div key={foodIndex} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-700">{food.name}</span>
                            <span className="text-gray-500">({food.quantity}{food.unit})</span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span>{food.calories} kcal</span>
                            <span className="text-green-600">P: {food.protein}g</span>
                            <span className="text-orange-600">C: {food.carbs}g</span>
                            <span className="text-yellow-600">G: {food.fat}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {meal.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">{meal.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ athletes }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Analytics e Relatórios</h3>
        
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">87%</p>
            <p className="text-sm text-gray-600">Taxa de Sucesso</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">23</p>
            <p className="text-sm text-gray-600">Objetivos Alcançados</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Satisfação Média</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Dias Totais Streak</p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Evolução de Aderência</h4>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <LineChart className="h-16 w-16" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Distribuição de Objetivos</h4>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <PieChart className="h-16 w-16" />
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-6 pt-6 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Dados atualizados em tempo real
          </p>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Share2 className="h-4 w-4 mr-2" />
              Partilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Database View Component
const DatabaseView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddFood, setShowAddFood] = useState(false);

  const categories = [
    { id: 'all', name: 'Todos', count: 2847 },
    { id: 'proteins', name: 'Proteínas', icon: Fish, count: 487 },
    { id: 'carbs', name: 'Carboidratos', icon: Wheat, count: 892 },
    { id: 'fats', name: 'Gorduras', icon: Droplets, count: 234 },
    { id: 'dairy', name: 'Lacticínios', icon: Milk, count: 345 },
    { id: 'fruits', name: 'Frutas', icon: Apple, count: 456 },
    { id: 'vegetables', name: 'Vegetais', icon: Salad, count: 433 }
  ];

  // Mock food database
  const foods = [
    { id: 1, name: 'Peito de Frango Grelhado', category: 'proteins', brand: 'Genérico', barcode: null, calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, serving: '100g' },
    { id: 2, name: 'Arroz Branco Cozido', category: 'carbs', brand: 'Genérico', barcode: null, calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, serving: '100g' },
    { id: 3, name: 'Abacate', category: 'fats', brand: 'Genérico', barcode: null, calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, serving: '100g' },
    { id: 4, name: 'Whey Protein Gold Standard', category: 'proteins', brand: 'Optimum Nutrition', barcode: '748927024081', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, serving: '30g' },
    { id: 5, name: 'Leite Magro', category: 'dairy', brand: 'Mimosa', barcode: '5601234567890', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, serving: '100ml' }
  ];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold text-gray-900">Base de Dados de Alimentos</h3>
            <span className="text-sm text-gray-500">{filteredFoods.length} alimentos</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Scan Código de Barras">
              <Scan className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Importar">
              <Upload className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddFood(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Alimento
            </button>
          </div>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar alimentos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="px-4 py-2 flex items-center space-x-4 overflow-x-auto">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{category.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alimento
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Porção
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calorias
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proteína
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carbs
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gordura
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fibra
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFoods.map(food => (
              <tr key={food.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{food.name}</p>
                    <p className="text-xs text-gray-500">{food.brand}</p>
                    {food.barcode && (
                      <p className="text-xs text-gray-400 mt-1">
                        <Package className="h-3 w-3 inline mr-1" />
                        {food.barcode}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {food.serving}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">{food.calories}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-green-600">{food.protein}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-orange-600">{food.carbs}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-yellow-600">{food.fat}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-purple-600">{food.fiber}g</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Tools View Component
const ToolsView = () => {
  const [activeCalculator, setActiveCalculator] = useState('calories');
  
  // Calculators data
  const calculators = [
    { id: 'calories', name: 'Calculadora de Calorias', icon: Flame, description: 'Calcula as necessidades calóricas diárias' },
    { id: 'macros', name: 'Calculadora de Macros', icon: PieChart, description: 'Distribui macronutrientes baseado nos objetivos' },
    { id: 'bmi', name: 'Calculadora de IMC', icon: Scale, description: 'Índice de Massa Corporal' },
    { id: 'bodyfat', name: 'Percentual de Gordura', icon: Percent, description: 'Estima o percentual de gordura corporal' },
    { id: 'water', name: 'Hidratação', icon: Droplets, description: 'Calcula necessidades de água' },
    { id: 'supplements', name: 'Suplementação', icon: Heart, description: 'Recomendações de suplementos' }
  ];

  return (
    <div className="space-y-6">
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calculators.map(calc => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                activeCalculator === calc.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`h-8 w-8 mb-3 ${
                activeCalculator === calc.id ? 'text-blue-600' : 'text-gray-600'
              }`} />
              <h4 className="font-semibold text-gray-900">{calc.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{calc.description}</p>
            </button>
          );
        })}
      </div>

      {/* Active Calculator */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeCalculator === 'calories' && <CaloriesCalculator />}
        {activeCalculator === 'macros' && <MacrosCalculator />}
        {activeCalculator === 'bmi' && <BMICalculator />}
        {activeCalculator === 'bodyfat' && <BodyFatCalculator />}
        {activeCalculator === 'water' && <WaterCalculator />}
        {activeCalculator === 'supplements' && <SupplementsCalculator />}
      </div>
    </div>
  );
};

// Calories Calculator Component
const CaloriesCalculator = () => {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [results, setResults] = useState(null);

  const calculateCalories = () => {
    const { gender, age, weight, height, activityLevel, goal } = formData;
    
    // Harris-Benedict Formula
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal adjustments
    let targetCalories = tdee;
    if (goal === 'lose') targetCalories = tdee - 500;
    if (goal === 'gain') targetCalories = tdee + 500;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      protein: Math.round(weight * 2.2), // 2.2g per kg
      carbs: Math.round((targetCalories * 0.4) / 4), // 40% from carbs
      fat: Math.round((targetCalories * 0.3) / 9), // 30% from fat
      fiber: gender === 'male' ? 38 : 25
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Calculadora de Necessidades Calóricas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setFormData({...formData, gender: 'male'})}
                className={`px-4 py-2 rounded-lg border-2 ${
                  formData.gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200'
                }`}
              >
                Masculino
              </button>
              <button
                onClick={() => setFormData({...formData, gender: 'female'})}
                className={`px-4 py-2 rounded-lg border-2 ${
                  formData.gender === 'female'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200'
                }`}
              >
                Feminino
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Anos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="kg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Altura</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="cm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Atividade</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sedentary">Sedentário</option>
              <option value="light">Levemente Ativo</option>
              <option value="moderate">Moderadamente Ativo</option>
              <option value="active">Muito Ativo</option>
              <option value="veryActive">Extremamente Ativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lose">Perder Peso</option>
              <option value="maintain">Manter Peso</option>
              <option value="gain">Ganhar Peso</option>
            </select>
          </div>

          <button
            onClick={calculateCalories}
            disabled={!formData.age || !formData.weight || !formData.height}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calcular
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Resultados</h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Taxa Metabólica Basal (TMB)</p>
                <p className="text-2xl font-bold text-gray-900">{results.bmr} kcal/dia</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Gasto Calórico Total (TDEE)</p>
                <p className="text-2xl font-bold text-gray-900">{results.tdee} kcal/dia</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">Calorias Recomendadas</p>
                <p className="text-3xl font-bold text-blue-600">{results.target} kcal/dia</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="font-medium text-gray-900 mb-2">Distribuição de Macros Sugerida</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Proteína</span>
                    <span className="text-sm font-medium text-green-600">{results.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Carboidratos</span>
                    <span className="text-sm font-medium text-orange-600">{results.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gordura</span>
                    <span className="text-sm font-medium text-yellow-600">{results.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fibra</span>
                    <span className="text-sm font-medium text-purple-600">{results.fiber}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Other calculator components (simplified placeholders)
const MacrosCalculator = () => (
  <div className="text-center py-12 text-gray-500">
    <PieChart className="h-16 w-16 mx-auto mb-4" />
    <p>Calculadora de Macros em desenvolvimento...</p>
  </div>
);

const BMICalculator = () => (
  <div className="text-center py-12 text-gray-500">
    <Scale className="h-16 w-16 mx-auto mb-4" />
    <p>Calculadora de IMC em desenvolvimento...</p>
  </div>
);

const BodyFatCalculator = () => (
  <div className="text-center py-12 text-gray-500">
    <Percent className="h-16 w-16 mx-auto mb-4" />
    <p>Calculadora de Gordura Corporal em desenvolvimento...</p>
  </div>
);

const WaterCalculator = () => (
  <div className="text-center py-12 text-gray-500">
    <Droplets className="h-16 w-16 mx-auto mb-4" />
    <p>Calculadora de Hidratação em desenvolvimento...</p>
  </div>
);

const SupplementsCalculator = () => (
  <div className="text-center py-12 text-gray-500">
    <Heart className="h-16 w-16 mx-auto mb-4" />
    <p>Recomendações de Suplementação em desenvolvimento...</p>
  </div>
);

// Create Plan Modal
const CreatePlanModal = ({ onClose, selectedAthlete, athletes }) => {
  const [step, setStep] = useState(1);
  const [planData, setPlanData] = useState({
    athleteId: selectedAthlete?.id || '',
    name: '',
    type: 'cutting',
    startDate: '',
    endDate: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: 30,
    water: 2500,
    mealPlan: 'flexible',
    weeklyCheckIn: true,
    supplements: [],
    restrictions: [],
    notes: ''
  });

  const handleSubmit = () => {
    console.log('Creating plan:', planData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Criar Novo Plano Nutricional</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {s === 1 ? 'Atleta' : s === 2 ? 'Macros' : 'Detalhes'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Step 1: Select Athlete */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Atleta
                </label>
                <select
                  value={planData.athleteId}
                  onChange={(e) => setPlanData({...planData, athleteId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Escolher atleta...</option>
                  {athletes.map(athlete => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.name} - {athlete.goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Plano
                </label>
                <input
                  type="text"
                  value={planData.name}
                  onChange={(e) => setPlanData({...planData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Plano de Cutting Progressivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Plano
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: 'cutting', label: 'Cutting', icon: Zap },
                    { value: 'bulking', label: 'Bulking', icon: TrendingUp },
                    { value: 'recomp', label: 'Recomposição', icon: RefreshCw },
                    { value: 'maintenance', label: 'Manutenção', icon: Shield }
                  ].map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setPlanData({...planData, type: option.value})}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          planData.type === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={planData.startDate}
                    onChange={(e) => setPlanData({...planData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={planData.endDate}
                    onChange={(e) => setPlanData({...planData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Macros */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  Use a calculadora para obter valores recomendados baseados no objetivo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorias Diárias
                </label>
                <input
                  type="number"
                  value={planData.calories}
                  onChange={(e) => setPlanData({...planData, calories: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    value={planData.protein}
                    onChange={(e) => setPlanData({...planData, protein: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={planData.carbs}
                    onChange={(e) => setPlanData({...planData, carbs: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="240"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gordura (g)
                  </label>
                  <input
                    type="number"
                    value={planData.fat}
                    onChange={(e) => setPlanData({...planData, fat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fibra (g)
                  </label>
                  <input
                    type="number"
                    value={planData.fiber}
                    onChange={(e) => setPlanData({...planData, fiber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Água (ml)
                  </label>
                  <input
                    type="number"
                    value={planData.water}
                    onChange={(e) => setPlanData({...planData, water: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Refeições
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'flexible', label: 'Flexível' },
                    { value: 'structured', label: 'Estruturado' },
                    { value: 'intermittent', label: 'Jejum Intermitente' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPlanData({...planData, mealPlan: option.value})}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        planData.mealPlan === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suplementos Recomendados
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Whey', 'Creatina', 'Multivitamínico', 'Ômega 3', 'Vitamina D', 'BCAA', 'Glutamina'].map(supp => (
                    <button
                      key={supp}
                      onClick={() => {
                        if (planData.supplements.includes(supp)) {
                          setPlanData({
                            ...planData,
                            supplements: planData.supplements.filter(s => s !== supp)
                          });
                        } else {
                          setPlanData({
                            ...planData,
                            supplements: [...planData.supplements, supp]
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        planData.supplements.includes(supp)
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border`}
                    >
                      {supp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restrições Alimentares
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Lactose', 'Glúten', 'Vegetariano', 'Vegano', 'Sem Açúcar', 'Low Carb'].map(rest => (
                    <button
                      key={rest}
                      onClick={() => {
                        if (planData.restrictions.includes(rest)) {
                          setPlanData({
                            ...planData,
                            restrictions: planData.restrictions.filter(r => r !== rest)
                          });
                        } else {
                          setPlanData({
                            ...planData,
                            restrictions: [...planData.restrictions, rest]
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        planData.restrictions.includes(rest)
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border`}
                    >
                      {rest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={planData.weeklyCheckIn}
                    onChange={(e) => setPlanData({...planData, weeklyCheckIn: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Check-in semanal obrigatório
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionais
                </label>
                <textarea
                  value={planData.notes}
                  onChange={(e) => setPlanData({...planData, notes: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instruções especiais, observações..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Anterior
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!planData.athleteId || !planData.name)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Criar Plano
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Athlete Detail Modal
const AthleteDetailModal = ({ athlete, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{athlete.name}</h2>
                <p className="text-gray-600">{athlete.goal} • {athlete.age} anos</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'plan', label: 'Plano Atual' },
              { id: 'history', label: 'Histórico' },
              { id: 'notes', label: 'Anotações' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {activeTab === 'overview' && athlete.nutritionPlan && (
            <div className="space-y-6">
              {/* Current Status */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Peso Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{athlete.weight}kg</p>
                  <p className="text-sm text-gray-500">
                    {athlete.nutritionPlan.progress.weightChange > 0 ? '+' : ''}
                    {athlete.nutritionPlan.progress.weightChange}kg desde o início
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Aderência Geral</p>
                  <p className="text-2xl font-bold text-blue-600">{athlete.nutritionPlan.compliance.overall}%</p>
                  <p className="text-sm text-gray-500">Últimos 7 dias</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{athlete.streak} dias</p>
                  <p className="text-sm text-gray-500">Consecutivos</p>
                </div>
              </div>

              {/* Progress Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Evolução de Peso</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <LineChart className="h-16 w-16" />
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  {athlete.nutritionPlan.recentMeals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{meal.date}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        meal.compliance >= 90 ? 'text-green-600' :
                        meal.compliance >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {meal.compliance}% de aderência
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && athlete.nutritionPlan && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{athlete.nutritionPlan.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(athlete.nutritionPlan.startDate).toLocaleDateString('pt-PT')} - 
                  {new Date(athlete.nutritionPlan.endDate).toLocaleDateString('pt-PT')}
                </p>
              </div>

              {/* Macros Detail */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Distribuição de Macronutrientes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Flame className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{athlete.nutritionPlan.calories}</p>
                    <p className="text-sm text-gray-600">Calorias</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Fish className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{athlete.nutritionPlan.protein}g</p>
                    <p className="text-sm text-gray-600">Proteína</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Wheat className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{athlete.nutritionPlan.carbs}g</p>
                    <p className="text-sm text-gray-600">Carboidratos</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <Droplets className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{athlete.nutritionPlan.fat}g</p>
                    <p className="text-sm text-gray-600">Gordura</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Suplementos</h4>
                  <div className="flex flex-wrap gap-2">
                    {athlete.nutritionPlan.supplements.map((supp, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                        {supp}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Restrições</h4>
                  <div className="flex flex-wrap gap-2">
                    {athlete.nutritionPlan.restrictions.map((rest, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                        {rest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-12 text-gray-500">
              <History className="h-16 w-16 mx-auto mb-4" />
              <p>Histórico de planos e evolução em desenvolvimento...</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4" />
              <p>Sistema de anotações em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Food Database Modal
const FoodDatabaseModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [scannedCode, setScannedCode] = useState('');

  // Mock recent searches
  const recentSearches = [
    'Peito de frango',
    'Arroz integral', 
    'Batata doce',
    'Aveia',
    'Ovo cozido'
  ];

  // Mock popular foods
  const popularFoods = [
    { name: 'Peito de Frango Grelhado', calories: 165, protein: 31 },
    { name: 'Arroz Branco Cozido', calories: 130, protein: 2.7 },
    { name: 'Batata Doce Cozida', calories: 86, protein: 1.6 },
    { name: 'Ovo Cozido', calories: 155, protein: 13 },
    { name: 'Banana', calories: 89, protein: 1.1 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Base de Dados de Alimentos</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Pesquisar
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scan'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Scan className="h-4 w-4 inline mr-2" />
              Código de Barras
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Criar Alimento
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar alimentos ou marcas..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  autoFocus
                />
              </div>

              {/* Recent Searches */}
              {!searchTerm && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Pesquisas Recentes</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(search)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
                      >
                        <Clock className="h-3 w-3 inline mr-1" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Foods */}
              {!searchTerm && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Alimentos Populares</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {popularFoods.map((food, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-500">Por 100g</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{food.calories} kcal</p>
                          <p className="text-xs text-gray-500">P: {food.protein}g</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchTerm && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">A mostrar resultados para "{searchTerm}"</p>
                  <div className="space-y-3">
                    {/* Mock search results */}
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Peito de Frango Grelhado</p>
                          <p className="text-sm text-gray-500">Genérico • 100g</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">165 kcal</p>
                          <p className="text-xs text-gray-500">P: 31g | C: 0g | G: 3.6g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="text-center py-12">
              <Scan className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Digitalizar Código de Barras</h3>
              <p className="text-gray-600 mb-6">Use a câmara do seu dispositivo ou digite o código manualmente</p>
              
              <div className="max-w-md mx-auto space-y-4">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Abrir Câmara
                </button>
                
                <div className="relative">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="Digite o código de barras"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  Adicione um novo alimento à base de dados. Será verificado antes de ficar disponível publicamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Alimento *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Iogurte Natural"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Danone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Porção (g/ml) *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calorias *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proteína (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carboidratos (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gordura (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saturada (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fibra (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açúcar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sódio (mg)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Adicionar Alimento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the main component
export default NutritionPageTrainer;