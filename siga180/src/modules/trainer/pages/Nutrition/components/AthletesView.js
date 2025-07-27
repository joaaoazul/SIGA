// src/modules/trainer/pages/Nutrition/components/AthletesView.js
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  BarChart3,
  Users,
  MoreVertical,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import AthleteCard from './cards/AthleteCard';

const AthletesView = ({ 
  athletes, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  onSelectAthlete, 
  onCreatePlan 
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Ordenar atletas
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
      {/* Search and Filters Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreatePlan={onCreatePlan}
      />

      {/* Athletes Display */}
      {viewMode === 'grid' ? (
        <AthletesGrid 
          athletes={sortedAthletes}
          onSelectAthlete={onSelectAthlete}
          onCreatePlan={onCreatePlan}
        />
      ) : (
        <AthletesTable
          athletes={sortedAthletes}
          onSelectAthlete={onSelectAthlete}
        />
      )}

      {/* Empty State */}
      {sortedAthletes.length === 0 && (
        <EmptyState 
          searchTerm={searchTerm}
          filterType={filterType}
        />
      )}
    </div>
  );
};

// Search and Filter Bar Component
const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onCreatePlan
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search Input */}
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
        
        {/* Controls */}
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
          <ViewModeToggle 
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

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
  );
};

// View Mode Toggle Component
const ViewModeToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center bg-gray-100 rounded-lg p-1">
    <button
      onClick={() => setViewMode('grid')}
      className={`p-1.5 rounded transition-colors ${
        viewMode === 'grid' ? 'bg-white shadow' : ''
      }`}
      title="Vista em grelha"
    >
      <BarChart3 className="h-4 w-4" />
    </button>
    <button
      onClick={() => setViewMode('list')}
      className={`p-1.5 rounded transition-colors ${
        viewMode === 'list' ? 'bg-white shadow' : ''
      }`}
      title="Vista em lista"
    >
      <Users className="h-4 w-4" />
    </button>
  </div>
);

// Athletes Grid View
const AthletesGrid = ({ athletes, onSelectAthlete, onCreatePlan }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {athletes.map(athlete => (
      <AthleteCard 
        key={athlete.id} 
        athlete={athlete} 
        onSelect={() => onSelectAthlete(athlete)}
        onCreatePlan={onCreatePlan}
      />
    ))}
  </div>
);

// Athletes Table View
const AthletesTable = ({ athletes, onSelectAthlete }) => (
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
        {athletes.map(athlete => (
          <AthleteTableRow 
            key={athlete.id}
            athlete={athlete}
            onSelectAthlete={onSelectAthlete}
          />
        ))}
      </tbody>
    </table>
  </div>
);

// Athlete Table Row Component
const AthleteTableRow = ({ athlete, onSelectAthlete }) => {
  const getComplianceColor = (compliance) => {
    if (!compliance) return '';
    if (compliance >= 90) return 'bg-green-100 text-green-800';
    if (compliance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {athlete.name.split(' ').map(n => n[0]).join('')}
            </span>
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
            getComplianceColor(athlete.nutritionPlan.compliance.overall)
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
  );
};

// Empty State Component
const EmptyState = ({ searchTerm, filterType }) => {
  const getMessage = () => {
    if (searchTerm) {
      return {
        title: 'Nenhum resultado encontrado',
        description: `Não foram encontrados atletas para "${searchTerm}"`
      };
    }
    
    switch (filterType) {
      case 'active':
        return {
          title: 'Sem atletas com plano ativo',
          description: 'Nenhum atleta tem um plano nutricional ativo no momento'
        };
      case 'inactive':
        return {
          title: 'Todos os atletas têm planos',
          description: 'Todos os seus atletas já têm planos nutricionais ativos'
        };
      case 'attention':
        return {
          title: 'Excelente trabalho!',
          description: 'Nenhum atleta precisa de atenção especial'
        };
      default:
        return {
          title: 'Sem atletas',
          description: 'Comece por adicionar o seu primeiro atleta'
        };
    }
  };

  const { title, description } = getMessage();

  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default AthletesView;