import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Calendar,
  Target,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  Activity,
  Apple,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  FileText,
  MessageSquare,
  BarChart3
} from 'lucide-react';

const AthletesView = () => {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch athletes data
  useEffect(() => {
    fetchAthletes();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...athletes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(athlete =>
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(athlete => {
        if (filterStatus === 'active') return athlete.activePlan;
        if (filterStatus === 'inactive') return !athlete.activePlan;
        if (filterStatus === 'compliant') return athlete.compliance >= 80;
        if (filterStatus === 'non-compliant') return athlete.compliance < 80;
        return true;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'compliance':
          return b.compliance - a.compliance;
        case 'lastCheckIn':
          return new Date(b.lastCheckIn) - new Date(a.lastCheckIn);
        default:
          return 0;
      }
    });

    setFilteredAthletes(filtered);
  }, [athletes, searchTerm, filterStatus, sortBy]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await nutritionAPI.getAthletes();
      // setAthletes(response.data);
      
      // Mock data for now
      const mockAthletes = [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          age: 28,
          goal: 'Ganho de Massa',
          activePlan: true,
          planName: 'Bulking 3500kcal',
          compliance: 92,
          lastCheckIn: '2025-01-25',
          currentWeight: 78.5,
          targetWeight: 82,
          weeklyProgress: +0.3,
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@example.com',
          age: 25,
          goal: 'Perda de Gordura',
          activePlan: true,
          planName: 'Cutting 1800kcal',
          compliance: 88,
          lastCheckIn: '2025-01-24',
          currentWeight: 62.3,
          targetWeight: 58,
          weeklyProgress: -0.5,
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
          id: 3,
          name: 'Pedro Costa',
          email: 'pedro@example.com',
          age: 32,
          goal: 'Manutenção',
          activePlan: true,
          planName: 'Manutenção 2500kcal',
          compliance: 95,
          lastCheckIn: '2025-01-26',
          currentWeight: 85.0,
          targetWeight: 85,
          weeklyProgress: 0,
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        {
          id: 4,
          name: 'Ana Ferreira',
          email: 'ana@example.com',
          age: 27,
          goal: 'Recomposição',
          activePlan: false,
          planName: null,
          compliance: 0,
          lastCheckIn: '2025-01-10',
          currentWeight: 58.2,
          targetWeight: 56,
          weeklyProgress: null,
          avatar: 'https://i.pravatar.cc/150?img=4'
        }
      ];

      setTimeout(() => {
        setAthletes(mockAthletes);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      setLoading(false);
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressIcon = (progress) => {
    if (!progress) return null;
    if (progress > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (progress < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/nutrition')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Atletas - Nutrição</h1>
        <p className="text-gray-600 mt-1">Gerir planos nutricionais dos seus atletas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Atletas</p>
              <p className="text-2xl font-bold">{athletes.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setFilterStatus('active')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planos Ativos</p>
              <p className="text-2xl font-bold">
                {athletes.filter(a => a.activePlan).length}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/nutrition/analytics')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Média</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  athletes
                    .filter(a => a.activePlan)
                    .reduce((sum, a) => sum + a.compliance, 0) /
                  athletes.filter(a => a.activePlan).length || 0
                )}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Check-ins Hoje</p>
              <p className="text-2xl font-bold">
                {athletes.filter(a => 
                  new Date(a.lastCheckIn).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar atletas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/nutrition/plans/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </button>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Com Plano Ativo</option>
              <option value="inactive">Sem Plano</option>
              <option value="compliant">Alta Compliance (≥80%)</option>
              <option value="non-compliant">Baixa Compliance (&lt;80%)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Nome</option>
              <option value="compliance">Compliance</option>
              <option value="lastCheckIn">Último Check-in</option>
            </select>
          </div>
        </div>
      </div>

      {/* Athletes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredAthletes.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum atleta encontrado</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objetivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Check-in
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAthletes.map((athlete) => (
                  <tr
                    key={athlete.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/nutrition/athlete/${athlete.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={athlete.avatar}
                          alt={athlete.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {athlete.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {athlete.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {athlete.goal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {athlete.activePlan ? (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-gray-900">{athlete.planName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Sem plano ativo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {athlete.activePlan ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${getComplianceColor(athlete.compliance)}`}>
                            {athlete.compliance}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                athlete.compliance >= 90 ? 'bg-green-500' :
                                athlete.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${athlete.compliance}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {athlete.weeklyProgress !== null ? (
                        <div className="flex items-center">
                          {getProgressIcon(athlete.weeklyProgress)}
                          <span className={`ml-1 text-sm font-medium ${
                            athlete.weeklyProgress > 0 ? 'text-green-600' :
                            athlete.weeklyProgress < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {athlete.weeklyProgress > 0 && '+'}
                            {athlete.weeklyProgress}kg/sem
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(athlete.lastCheckIn).toLocaleDateString('pt-PT')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {!athlete.activePlan && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/nutrition/plans/create?athleteId=${athlete.id}`);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Criar Plano"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement message functionality
                            console.log('Send message to:', athlete.id);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="Enviar Mensagem"
                        >
                          <MessageSquare className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/nutrition/athlete/${athlete.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver Detalhes"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthletesView;