// src/modules/trainer/pages/Nutrition/views/PlansView.js
import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
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
import { mockAthletes } from '../data/mockData';
import { PlanCardSkeleton } from '../components/ui/Skeletons';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

// Lazy load do PlanCard para melhor performance
const PlanCard = lazy(() => import('../components/cards/PlanCard'));

const PlansView = ({ athletes, onCreatePlan }) => {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const { addToast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  
  // Use mock data if no athletes provided
  athletes = athletes || mockAthletes;

  // Memoized: Extrair planos ativos dos atletas
  const activePlans = useMemo(() => {
    return athletes
      .filter(a => a.nutritionPlan)
      .map(a => ({
        ...a.nutritionPlan,
        athleteName: a.name,
        athleteId: a.id,
        athleteGoal: a.goal,
        athleteEmail: a.email
      }));
  }, [athletes]);

  // Memoized: Filtrar planos
  const filteredPlans = useMemo(() => {
    return activePlans.filter(plan => {
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
  }, [activePlans, searchTerm, filterType]);

  // Memoized: Ordenar planos
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

  // Callbacks otimizados
  const handleDeletePlan = useCallback(async (planId, planName) => {
    const confirmed = await confirm({
      title: 'Eliminar Plano',
      message: `Tem a certeza que deseja eliminar o plano "${planName}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Eliminar',
      type: 'danger'
    });

    if (confirmed) {
      setIsLoading(true);
      
      // Simular API call
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'Plano eliminado',
          message: `O plano "${planName}" foi eliminado com sucesso.`,
          action: {
            label: 'Desfazer',
            onClick: () => {
              addToast({
                type: 'info',
                message: 'Ação desfeita'
              });
            }
          }
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [confirm, addToast]);

  const handleCopyPlan = useCallback((planName) => {
    addToast({
      type: 'success',
      message: `Plano "${planName}" copiado com sucesso!`
    });
  }, [addToast]);

  const handleExport = useCallback(() => {
    addToast({
      type: 'info',
      title: 'A exportar planos...',
      message: 'O download começará em breve.',
      duration: 3000
    });
  }, [addToast]);

  // Simular loading inicial
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Actions com animação */}
      <div className="animate-fadeIn">
        <PlansHeader
          totalPlans={activePlans.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onCreatePlan={onCreatePlan}
          onExport={handleExport}
        />
      </div>

      {/* Plans Grid com loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <PlanCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedPlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPlans.map((plan, index) => (
            <Suspense key={plan.id} fallback={<PlanCardSkeleton />}>
              <div 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PlanCard 
                  plan={plan}
                  onDelete={() => handleDeletePlan(plan.id, plan.name)}
                  onCopy={() => handleCopyPlan(plan.name)}
                />
              </div>
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="animate-fadeIn">
          <EmptyState searchTerm={searchTerm} filterType={filterType} />
        </div>
      )}

      {/* Templates Section com lazy loading */}
      <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <TemplatesSection onCreatePlan={onCreatePlan} />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
};

// Header Component otimizado
const PlansHeader = React.memo(({
  totalPlans,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  onCreatePlan,
  onExport
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Title and Actions */}
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-900">
            Planos Ativos ({totalPlans})
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-4 w-4 inline mr-1" />
              Filtrar
            </button>
            <button 
              onClick={onExport}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Exportar
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Search com debounce */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar planos..."
              className="w-full sm:w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Filters com transições */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          >
            <option value="all">Todos os tipos</option>
            <option value="cutting">Cutting</option>
            <option value="bulking">Bulking</option>
            <option value="recomp">Recomposição</option>
            <option value="maintenance">Manutenção</option>
            <option value="expiring">A expirar</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          >
            <option value="recent">Mais recentes</option>
            <option value="name">Nome</option>
            <option value="athlete">Atleta</option>
            <option value="ending">Data de fim</option>
          </select>

          {/* Create Button com hover animation */}
          <button
            onClick={onCreatePlan}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </button>
        </div>
      </div>
    </div>
  );
});

PlansHeader.displayName = 'PlansHeader';

// Templates Section Component
const TemplatesSection = React.memo(({ onCreatePlan }) => {
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
    <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Templates Disponíveis</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
          Ver todos
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <TemplateCard 
            key={index}
            template={template}
            onSelect={onCreatePlan}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
});

TemplatesSection.displayName = 'TemplatesSection';

// Template Card Component com animação
const TemplateCard = ({ template, onSelect, delay }) => {
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
      className={`p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-center group transform hover:scale-105 animate-fadeIn`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${colorClasses[template.color]} transition-all group-hover:scale-110`}>
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
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeiro Plano
        </button>
      )}
    </div>
  );
};

export default PlansView;