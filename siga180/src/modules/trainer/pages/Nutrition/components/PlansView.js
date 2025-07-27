// src/modules/trainer/pages/Nutrition/components/PlansView.js
import React, { useState } from 'react';
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
  Send,
  Eye,
  FileText,
  Activity,
  Zap,
  RefreshCw,
  Shield
} from 'lucide-react';
import PlanCard from './cards/PlanCard';

const PlansView = ({ athletes, onCreatePlan }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Extrair planos ativos dos atletas
  const activePlans = athletes
    .filter(a => a.nutritionPlan)
    .map(a => ({
      ...a.nutritionPlan,
      athleteName: a.name,
      athleteId: a.id,
      athleteGoal: a.goal,
      athleteEmail: a.email
    }));

  // Filtrar planos
  const filteredPlans = activePlans.filter(plan => {
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

  // Ordenar planos
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdate) - new Date(a.lastUpdate);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'athlete':
        return a.athleteName.localeCompare(b.athleteName);
      case 'ending':
        return new Date(a.endDate) - new Date(b.endDate);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <PlansHeader
        totalPlans={activePlans.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCreatePlan={onCreatePlan}
      />

      {/* Plans Grid */}
      {sortedPlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} filterType={filterType} />
      )}

      {/* Templates Section */}
      <TemplatesSection onCreatePlan={onCreatePlan} />
    </div>
  );
};

// Plans Header Component
const PlansHeader = ({
  totalPlans,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  onCreatePlan
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Title and Actions */}
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-900">
            Planos Ativos ({totalPlans})
          </h3>
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

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar planos..."
              className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="cutting">Cutting</option>
            <option value="bulking">Bulking</option>
            <option value="recomp">Recomposição</option>
            <option value="maintenance">Manutenção</option>
            <option value="expiring">A expirar</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="recent">Mais recentes</option>
            <option value="name">Nome</option>
            <option value="athlete">Atleta</option>
            <option value="ending">Data de fim</option>
          </select>

          {/* Create Button */}
          <button
            onClick={onCreatePlan}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </button>
        </div>
      </div>
    </div>
  );
};

// Templates Section Component
const TemplatesSection = ({ onCreatePlan }) => {
  const templates = [
    { 
      name: 'Cutting Agressivo', 
      icon: Zap, 
      color: 'red',
      description: 'Perda rápida de gordura',
      duration: '8 semanas'
    },
    { 
      name: 'Bulking Limpo', 
      icon: TrendingUp, 
      color: 'blue',
      description: 'Ganho de massa magra',
      duration: '12 semanas'
    },
    { 
      name: 'Recomposição', 
      icon: RefreshCw, 
      color: 'purple',
      description: 'Perder gordura e ganhar músculo',
      duration: '16 semanas'
    },
    { 
      name: 'Manutenção', 
      icon: Shield, 
      color: 'green',
      description: 'Manter peso atual',
      duration: 'Contínuo'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Templates Disponíveis</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Ver todos
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <TemplateCard 
            key={index}
            template={template}
            onSelect={onCreatePlan}
          />
        ))}
      </div>
    </div>
  );
};

// Template Card Component
const TemplateCard = ({ template, onSelect }) => {
  const Icon = template.icon;
  const colorClasses = {
    red: 'text-red-600 bg-red-50 hover:bg-red-100',
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
    green: 'text-green-600 bg-green-50 hover:bg-green-100'
  };

  return (
    <button
      onClick={onSelect}
      className={`p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-center group`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${colorClasses[template.color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
      <span className="text-xs text-gray-500">
        <Clock className="h-3 w-3 inline mr-1" />
        {template.duration}
      </span>
    </button>
  );
};

// Empty State Component
const EmptyState = ({ searchTerm, filterType }) => {
  const getMessage = () => {
    if (searchTerm) {
      return {
        icon: Search,
        title: 'Nenhum plano encontrado',
        description: `Não foram encontrados planos para "${searchTerm}"`
      };
    }

    if (filterType === 'expiring') {
      return {
        icon: Calendar,
        title: 'Sem planos a expirar',
        description: 'Nenhum plano está prestes a terminar nos próximos 7 dias'
      };
    }

    if (filterType !== 'all') {
      return {
        icon: Filter,
        title: `Sem planos de ${filterType}`,
        description: 'Não existem planos deste tipo ativos no momento'
      };
    }

    return {
      icon: FileText,
      title: 'Sem planos ativos',
      description: 'Comece por criar o primeiro plano nutricional'
    };
  };

  const { icon: Icon, title, description } = getMessage();

  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {filterType === 'all' && !searchTerm && (
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeiro Plano
        </button>
      )}
    </div>
  );
};

// Plans Stats Component (optional addition)
const PlansStats = ({ plans }) => {
  const stats = {
    expiringSoon: plans.filter(p => {
      const daysLeft = Math.ceil(
        (new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft <= 7 && daysLeft > 0;
    }).length,
    
    avgCompliance: Math.round(
      plans.reduce((acc, p) => acc + (p.compliance?.overall || 0), 0) / plans.length
    ),
    
    typeDistribution: {
      cutting: plans.filter(p => p.type === 'cutting').length,
      bulking: plans.filter(p => p.type === 'bulking').length,
      recomp: plans.filter(p => p.type === 'recomp').length,
      maintenance: plans.filter(p => p.type === 'maintenance').length
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
        <p className="text-sm text-gray-600">A expirar brevemente</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-900">{stats.avgCompliance}%</p>
        <p className="text-sm text-gray-600">Aderência média</p>
      </div>
      
      {/* Add more stat cards as needed */}
    </div>
  );
};

export default PlansView;