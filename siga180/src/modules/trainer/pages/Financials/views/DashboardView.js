import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Users, AlertTriangle,
  CreditCard, FileText, BarChart3, Calendar, Plus, Download,
  RefreshCw, Filter, ChevronRight, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, Wallet, PieChart, Activity,
  Target, Zap, Award, AlertCircle, MoreVertical, Eye,
  Send, Banknote, Receipt, ArrowRight, Euro, Percent,
  ShoppingCart, Package, Star, Bell, Search, Settings,
  Dumbbell
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart,
  RadialBar, ComposedChart, Scatter
} from 'recharts';

const FinancialsPage = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data avançado
  const mockStats = {
    revenue: {
      current: 12850,
      previous: 10200,
      growth: 25.9,
      pending: 2150,
      projected: 14500
    },
    overdue: {
      amount: 850,
      count: 4,
      avgDays: 12
    },
    expenses: {
      current: 3200,
      previous: 2800,
      categories: {
        rent: 1200,
        equipment: 800,
        marketing: 500,
        utilities: 400,
        other: 300
      }
    },
    profit: {
      current: 9650,
      margin: 75.1,
      target: 10000
    },
    athletes: {
      active: 42,
      new: 8,
      churn: 2,
      lifetime: 38400
    },
    subscriptions: {
      active: 38,
      trial: 4,
      cancelled: 2,
      mrr: 4560
    }
  };

  // Dados para gráficos
  const chartData = {
    revenue: [
      { month: 'Jan', revenue: 8500, expenses: 2100, profit: 6400, athletes: 28 },
      { month: 'Fev', revenue: 9200, expenses: 2300, profit: 6900, athletes: 31 },
      { month: 'Mar', revenue: 10200, expenses: 2500, profit: 7700, athletes: 35 },
      { month: 'Abr', revenue: 10800, expenses: 2600, profit: 8200, athletes: 37 },
      { month: 'Mai', revenue: 11500, expenses: 2800, profit: 8700, athletes: 39 },
      { month: 'Jun', revenue: 12850, expenses: 3200, profit: 9650, athletes: 42 }
    ],
    dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      amount: Math.floor(Math.random() * 600) + 200,
      payments: Math.floor(Math.random() * 8) + 1
    })),
    categoryBreakdown: [
      { name: 'Mensalidades', value: 9800, percentage: 76 },
      { name: 'Personal Training', value: 1850, percentage: 14 },
      { name: 'Nutrição', value: 650, percentage: 5 },
      { name: 'Avaliações', value: 550, percentage: 5 }
    ],
    athleteDistribution: [
      { plan: 'Basic', count: 12, revenue: 960, color: '#94a3b8' },
      { plan: 'Standard', count: 18, revenue: 2160, color: '#3b82f6' },
      { plan: 'Premium', count: 8, revenue: 1440, color: '#8b5cf6' },
      { plan: 'VIP', count: 4, revenue: 1000, color: '#f59e0b' }
    ]
  };

  const recentTransactions = [
    { id: 1, athlete: 'João Silva', amount: 120, type: 'subscription', status: 'completed', date: '2 min', avatar: '👨' },
    { id: 2, athlete: 'Maria Santos', amount: 80, type: 'payment', status: 'pending', date: '1 hora', avatar: '👩' },
    { id: 3, athlete: 'Pedro Costa', amount: 150, type: 'personal', status: 'completed', date: '3 horas', avatar: '👨' },
    { id: 4, athlete: 'Ana Ferreira', amount: 120, type: 'subscription', status: 'failed', date: '5 horas', avatar: '👩' },
    { id: 5, athlete: 'Carlos Mendes', amount: 200, type: 'evaluation', status: 'completed', date: 'Ontem', avatar: '👨' }
  ];

  const upcomingPayments = [
    { athlete: 'Miguel Sousa', amount: 120, dueDate: '05/02', daysLeft: 2, risk: 'low' },
    { athlete: 'Sofia Martins', amount: 80, dueDate: '06/02', daysLeft: 3, risk: 'low' },
    { athlete: 'Ricardo Lima', amount: 150, dueDate: '08/02', daysLeft: 5, risk: 'medium' },
    { athlete: 'Beatriz Alves', amount: 120, dueDate: '10/02', daysLeft: 7, risk: 'high' }
  ];

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      updateLiveData();
    }, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setStats(mockStats);
      setRevenueData(chartData.revenue);
      setLoading(false);
    }, 1000);
  };

  const updateLiveData = () => {
    // Simular atualizações em tempo real
    setStats(prev => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        current: prev.revenue.current + Math.floor(Math.random() * 100)
      }
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-orange-600 bg-orange-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };
    return colors[risk] || 'bg-gray-500';
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  // Custom Tooltip para gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: €{entry.value.toLocaleString('pt-PT')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Euro className="h-12 w-12 text-blue-400 opacity-75" />
          </div>
          <Euro className="h-12 w-12 text-blue-600 relative" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  Gestão Financeira
                  {stats?.revenue.growth > 20 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full animate-pulse">
                      ON FIRE 🔥
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Dashboard completo • Última atualização há 2 min
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === 'week'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === 'month'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setSelectedPeriod('year')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === 'year'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ano
                </button>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleRefresh}
                className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all ${
                  refreshing ? 'animate-spin' : ''
                }`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* KPI Cards - Design Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Receita Total</p>
                  <Zap className="h-3 w-3 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  €{stats?.revenue.current.toLocaleString('pt-PT')}
                </p>
                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-semibold text-green-600">
                      +{stats?.revenue.growth}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">vs último mês</span>
                </div>
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(stats?.revenue.growth * 4, 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Euro className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* MRR Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">MRR</p>
                  <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  €{stats?.subscriptions.mrr.toLocaleString('pt-PT')}
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {stats?.subscriptions.active} ativos
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {stats?.subscriptions.trial} trial
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Margem Lucro</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.profit.margin}%
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Target: {stats?.profit.target}</span>
                    <span className="font-medium text-gray-700">€{stats?.profit.current}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats?.profit.margin}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Percent className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Athletes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Atletas Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.athletes.active}
                </p>
                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 font-medium">+{stats?.athletes.new} novos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-red-600 font-medium">-{stats?.athletes.churn} saíram</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Pending/Overdue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pendências</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  €{(stats?.revenue.pending + stats?.overdue.amount).toLocaleString('pt-PT')}
                </p>
                <div className="flex items-center mt-3 space-x-3">
                  <span className="flex items-center text-xs">
                    <Clock className="h-3 w-3 mr-1 text-orange-500" />
                    €{stats?.revenue.pending} pendente
                  </span>
                  <span className="flex items-center text-xs">
                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                    €{stats?.overdue.amount} atrasado
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Análise de Receita</h2>
                  <p className="text-sm text-gray-500 mt-1">Evolução mensal com projeções</p>
                </div>
                <div className="flex items-center space-x-2">
                  {['revenue', 'profit', 'expenses'].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        selectedMetric === metric
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {metric === 'revenue' ? 'Receita' : metric === 'profit' ? 'Lucro' : 'Despesas'}
                    </button>
                  ))}
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData.revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Receita"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Lucro"
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#ef4444"
                    opacity={0.3}
                    name="Despesas"
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Mini stats below chart */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Média Mensal</p>
                  <p className="text-lg font-bold text-gray-900">€10,458</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Melhor Mês</p>
                  <p className="text-lg font-bold text-green-600">€12,850</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Crescimento YoY</p>
                  <p className="text-lg font-bold text-blue-600">+42%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Projeção</p>
                  <p className="text-lg font-bold text-purple-600">€14,500</p>
                </div>
              </div>
            </div>

            {/* Daily Revenue Heatmap */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Atividade Diária</h3>
                <span className="text-sm text-gray-500">Últimos 30 dias</span>
              </div>
              
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {chartData.dailyRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > 400 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  Ver todas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xl">
                          {transaction.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          transaction.status === 'completed' ? 'bg-green-500' :
                          transaction.status === 'pending' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.athlete}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' ? 'Pago' :
                             transaction.status === 'pending' ? 'Pendente' :
                             transaction.status === 'failed' ? 'Falhou' : 'Cancelado'}
                          </span>
                          <span className="text-xs text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">€{transaction.amount}</p>
                        <p className="text-xs text-gray-500">{transaction.type}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição de Receita</h3>
              
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={chartData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {chartData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2 mt-4">
                {chartData.categoryBreakdown.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">€{category.value}</span>
                      <span className="text-xs text-gray-500">({category.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Próximos Pagamentos</h3>
                <Send className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {upcomingPayments.map((payment, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{payment.athlete}</span>
                      <span className="font-bold text-gray-900">€{payment.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{payment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{payment.daysLeft}d</span>
                        <div className={`w-2 h-2 rounded-full ${getRiskColor(payment.risk)}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors">
                Enviar Lembretes
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all group">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-5 w-5" />
                    <span className="font-medium">Nova Fatura</span>
                  </div>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all group">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Processar Pagamento</span>
                  </div>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all group">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Gerar Relatório</span>
                  </div>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Taxa de Cobrança</span>
                    <span className="text-sm font-bold text-gray-900">92%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Retenção</span>
                    <span className="text-sm font-bold text-gray-900">87%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Churn Rate</span>
                    <span className="text-sm font-bold text-gray-900">5%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">LTV Médio</span>
                    <span className="text-sm font-bold text-gray-900">€1,240</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Expense Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Análise de Despesas</h3>
              <span className="text-sm text-gray-500">Este mês</span>
            </div>
            
            <div className="space-y-3">
              {Object.entries(stats?.expenses.categories || {}).map(([category, amount]) => {
                const percentage = (amount / stats.expenses.current * 100).toFixed(1);
                const icons = {
                  rent: Package,
                  equipment: Dumbbell,
                  marketing: Target,
                  utilities: Zap,
                  other: MoreVertical
                };
                const Icon = icons[category] || MoreVertical;
                const colors = {
                  rent: 'bg-blue-500',
                  equipment: 'bg-purple-500',
                  marketing: 'bg-pink-500',
                  utilities: 'bg-orange-500',
                  other: 'bg-gray-500'
                };
                
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className={`p-2 ${colors[category]} rounded-lg bg-opacity-10`}>
                      <Icon className={`h-5 w-5 ${colors[category].replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                        <span className="text-sm font-bold text-gray-900">€{amount}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors[category]} rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total de Despesas</span>
                <span className="text-lg font-bold text-gray-900">€{stats?.expenses.current}</span>
              </div>
            </div>
          </div>

          {/* Athlete Plans Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Distribuição de Planos</h3>
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {chartData.athleteDistribution.map((plan) => (
                <div
                  key={plan.plan}
                  className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group"
                  style={{ borderLeftColor: plan.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{plan.plan}</span>
                    <Star className="h-4 w-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{plan.count}</p>
                  <p className="text-sm text-gray-500 mt-1">€{plan.revenue}/mês</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsPage;