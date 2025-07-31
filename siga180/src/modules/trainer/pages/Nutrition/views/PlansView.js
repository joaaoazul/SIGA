import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Users,
  Target,
  Clock,
  Edit2,
  Copy,
  Trash2,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  ArrowLeft,
  Eye,
  FileText,
  Activity
} from 'lucide-react';

const PlansView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Mock data - substituir com API
  const mockPlans = [
    {
      id: 1,
      name: 'Plano Bulking 3500kcal',
      type: 'bulking',
      athleteName: 'João Silva',
      athleteId: 1,
      athleteGoal: 'Ganho de Massa',
      startDate: '2025-01-01',
      endDate: '2025-03-01',
      status: 'active',
      compliance: 92,
      lastUpdate: '2025-01-25',
      macros: {
        calories: 3500,
        protein: 175,
        carbs: 437,
        fat: 117
      }
    },
    {
      id: 2,
      name: 'Plano Cutting 1800kcal',
      type: 'cutting',
      athleteName: 'Maria Santos',
      athleteId: 2,
      athleteGoal: 'Perda de Gordura',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      status: 'active',
      compliance: 88,
      lastUpdate: '2025-01-24',
      macros: {
        calories: 1800,
        protein: 140,
        carbs: 180,
        fat: 60
      }
    },
    {
      id: 3,
      name: 'Plano Manutenção 2500kcal',
      type: 'maintenance',
      athleteName: 'Pedro Costa',
      athleteId: 3,
      athleteGoal: 'Manutenção',
      startDate: '2024-12-01',
      endDate: '2025-02-01',
      status: 'active',
      compliance: 95,
      lastUpdate: '2025-01-23',
      macros: {
        calories: 2500,
        protein: 150,
        carbs: 300,
        fat: 83
      }
    }
  ];

  // Filter plans
  const filteredPlans = useMemo(() => {
    return mockPlans.filter(plan => {
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.athleteName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'expiring') {
        const daysUntilEnd = Math.ceil(
          (new Date(plan.endDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return matchesSearch && daysUntilEnd <= 7;
      }
      return matchesSearch && plan.type === filterType;
    });
  }, [searchTerm, filterType]);

  // Sort plans
  const sortedPlans = useMemo(() => {
    const sorted = [...filteredPlans];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'athlete':
        return sorted.sort((a, b) => a.athleteName.localeCompare(b.athleteName));
      case 'ending':
        return sorted.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      default:
        return sorted;
    }
  }, [filteredPlans, sortBy]);

  const handleDeletePlan = async (planId, planName) => {
    if (showDeleteConfirm === planId) {
      // Mostrar loading toast
      const loadingToast = toast.loading('A eliminar plano...');
      
      try {
        // TODO: API call para eliminar
        // await nutritionAPI.deletePlan(planId);
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sucesso
        toast.success(`Plano "${planName}" eliminado com sucesso!`, {
          id: loadingToast,
        });
        
        setShowDeleteConfirm(null);
        // TODO: Atualizar lista de planos
      } catch (error) {
        toast.error('Erro ao eliminar plano', {
          id: loadingToast,
        });
      }
    }
  };

  const handleCopyPlan = (plan) => {
    // Mostrar toast de sucesso
    toast.success(`Plano "${plan.name}" copiado!`);
    
    // Navegar para criar novo plano com dados copiados
    navigate('/nutrition/plans/create', { 
      state: { duplicateFrom: plan } 
    });
  };

  const handleExportPlans = async () => {
    const exportToast = toast.loading('A preparar exportação...');
    
    try {
      // TODO: Implementar exportação real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular download
      const data = {
        plans: sortedPlans,
        exportDate: new Date().toISOString(),
        totalPlans: sortedPlans.length
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planos-nutricionais-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Planos exportados com sucesso!', {
        id: exportToast,
      });
    } catch (error) {
      toast.error('Erro ao exportar planos', {
        id: exportToast,
      });
    }
  };

  const getDaysRemaining = (endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bulking':
        return 'bg-green-100 text-green-800';
      case 'cutting':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/nutrition')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Planos Nutricionais</h1>
        <p className="text-gray-600 mt-1">Gerir planos ativos dos seus atletas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Planos</p>
              <p className="text-2xl font-bold">{mockPlans.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atletas com Plano</p>
              <p className="text-2xl font-bold">{mockPlans.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Média</p>
              <p className="text-2xl font-bold">
                {Math.round(mockPlans.reduce((sum, p) => sum + p.compliance, 0) / mockPlans.length)}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">A Expirar</p>
              <p className="text-2xl font-bold">
                {mockPlans.filter(p => getDaysRemaining(p.endDate) <= 7).length}
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
                placeholder="Pesquisar planos ou atletas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/nutrition/plans/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </button>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="bulking">Bulking</option>
              <option value="cutting">Cutting</option>
              <option value="maintenance">Manutenção</option>
              <option value="expiring">A Expirar (7 dias)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name">Nome</option>
              <option value="athlete">Atleta</option>
              <option value="ending">Data de Fim</option>
            </select>

            <button
              onClick={handleExportPlans}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              title="Exportar Planos"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {sortedPlans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum plano encontrado' : 'Sem planos ativos'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? `Não foram encontrados planos para "${searchTerm}"`
              : 'Comece por criar o primeiro plano nutricional'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={() => navigate('/nutrition/plans/create')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Plano
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Plan Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Para {plan.athleteName} • {plan.athleteGoal}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(plan.type)}`}>
                    {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                  </span>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Calorias</p>
                    <p className="text-sm font-semibold">{plan.macros.calories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Proteína</p>
                    <p className="text-sm font-semibold">{plan.macros.protein}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Carbs</p>
                    <p className="text-sm font-semibold">{plan.macros.carbs}g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Gordura</p>
                    <p className="text-sm font-semibold">{plan.macros.fat}g</p>
                  </div>
                </div>

                {/* Progress and Info */}
                <div className="space-y-3">
                  {/* Compliance */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Compliance</span>
                      <span className="font-medium">{plan.compliance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          plan.compliance >= 90 ? 'bg-green-500' :
                          plan.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${plan.compliance}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(plan.startDate).toLocaleDateString('pt-PT')} - 
                        {new Date(plan.endDate).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <span className={`font-medium ${
                      getDaysRemaining(plan.endDate) <= 7 ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {getDaysRemaining(plan.endDate)} dias restantes
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/nutrition/athlete/${plan.athleteId}`)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    Ver Atleta
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => navigate(`/nutrition/plans/edit/${plan.id}`)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="h-4 w-4 inline mr-1" />
                    Editar
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleCopyPlan(plan)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
                    title="Duplicar Plano"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(plan.id)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
                    title="Eliminar Plano"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === plan.id && (
                <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center p-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Eliminar Plano?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Templates Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/nutrition/plans/create?template=bulking')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-sm transition-all text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg mb-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="font-medium text-gray-900">Bulking</h4>
            <p className="text-xs text-gray-600 mt-1">Ganho de massa</p>
          </button>

          <button
            onClick={() => navigate('/nutrition/plans/create?template=cutting')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-sm transition-all text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg mb-2">
              <Target className="h-5 w-5" />
            </div>
            <h4 className="font-medium text-gray-900">Cutting</h4>
            <p className="text-xs text-gray-600 mt-1">Perda de gordura</p>
          </button>

          <button
            onClick={() => navigate('/nutrition/plans/create?template=maintenance')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg mb-2">
              <Activity className="h-5 w-5" />
            </div>
            <h4 className="font-medium text-gray-900">Manutenção</h4>
            <p className="text-xs text-gray-600 mt-1">Manter peso</p>
          </button>

          <button
            onClick={() => navigate('/nutrition/plans/create?template=athlete')}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-sm transition-all text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-lg mb-2">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="font-medium text-gray-900">Atleta</h4>
            <p className="text-xs text-gray-600 mt-1">Alto rendimento</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlansView;