// src/components/athletes/AthleteList.js
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, 
  Phone, Mail, Target, TrendingUp, TrendingDown, Users,
  Calendar, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

const AthleteList = ({ athletes = [], onEdit, onDelete, onView, onAdd }) => {
  // Estados para controlo da interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  // Opções de filtros
  const filterOptions = [
    { value: 'all', label: 'Todos os Atletas', count: athletes.length },
    { value: 'active', label: 'Ativos', count: athletes.filter(a => a.membership.status === 'active').length },
    { value: 'inactive', label: 'Inativos', count: athletes.filter(a => a.membership.status === 'inactive').length },
    { value: 'beginner', label: 'Iniciantes', count: athletes.filter(a => a.healthInfo.fitnessLevel === 'beginner').length },
    { value: 'intermediate', label: 'Intermédios', count: athletes.filter(a => a.healthInfo.fitnessLevel === 'intermediate').length },
    { value: 'advanced', label: 'Avançados', count: athletes.filter(a => a.healthInfo.fitnessLevel === 'advanced').length }
  ];

  // Função para filtrar e ordenar atletas
  const filteredAndSortedAthletes = useMemo(() => {
    let filtered = athletes;

    // Aplicar filtro de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(athlete => 
        athlete.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.goals.primary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros de categoria
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'active':
        case 'inactive':
          filtered = filtered.filter(athlete => athlete.membership.status === selectedFilter);
          break;
        case 'beginner':
        case 'intermediate':
        case 'advanced':
          filtered = filtered.filter(athlete => athlete.healthInfo.fitnessLevel === selectedFilter);
          break;
        default:
          break;
      }
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.personalInfo.name.toLowerCase();
          bValue = b.personalInfo.name.toLowerCase();
          break;
        case 'progress':
          aValue = a.metrics.progress.overallProgress || 0;
          bValue = b.metrics.progress.overallProgress || 0;
          break;
        case 'attendance':
          aValue = a.metrics.attendance.percentage || 0;
          bValue = b.metrics.attendance.percentage || 0;
          break;
        case 'joinDate':
          aValue = new Date(a.membership.startDate);
          bValue = new Date(b.membership.startDate);
          break;
        default:
          aValue = a.personalInfo.name.toLowerCase();
          bValue = b.personalInfo.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [athletes, searchTerm, selectedFilter, sortBy, sortOrder]);

  // Função para calcular estatísticas
  const statistics = useMemo(() => {
    const activeAthletes = athletes.filter(a => a.membership.status === 'active');
    const avgProgress = athletes.reduce((sum, a) => sum + (a.metrics.progress.overallProgress || 0), 0) / athletes.length;
    const avgAttendance = athletes.reduce((sum, a) => sum + (a.metrics.attendance.percentage || 0), 0) / athletes.length;
    
    return {
      total: athletes.length,
      active: activeAthletes.length,
      avgProgress: Math.round(avgProgress),
      avgAttendance: Math.round(avgAttendance)
    };
  }, [athletes]);

  // Componente do cabeçalho com estatísticas
  const StatisticsHeader = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Atletas</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Ativos</p>
            <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Progresso Médio</p>
            <p className="text-2xl font-bold text-purple-600">{statistics.avgProgress}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-500" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Frequência Média</p>
            <p className="text-2xl font-bold text-yellow-600">{statistics.avgAttendance}%</p>
          </div>
          <Calendar className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );

  // Componente dos controles de pesquisa e filtros
  const SearchAndFilters = () => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Barra de pesquisa */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort);
              setSortOrder(order);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="progress-desc">Maior Progresso</option>
            <option value="progress-asc">Menor Progresso</option>
            <option value="attendance-desc">Maior Frequência</option>
            <option value="attendance-asc">Menor Frequência</option>
            <option value="joinDate-desc">Mais Recentes</option>
            <option value="joinDate-asc">Mais Antigos</option>
          </select>

          <button
            onClick={onAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Novo Atleta</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Componente do card individual do atleta
  const AthleteCard = ({ athlete }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-red-100 text-red-800';
        case 'suspended': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getFitnessLevelColor = (level) => {
      switch (level) {
        case 'beginner': return 'bg-blue-100 text-blue-800';
        case 'intermediate': return 'bg-purple-100 text-purple-800';
        case 'advanced': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header do card */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {getInitials(athlete.personalInfo.name)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{athlete.personalInfo.name}</h3>
                <p className="text-sm text-gray-600">{athlete.goals.primary}</p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => {
                      onView(athlete.id);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => {
                      onEdit(athlete.id);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(athlete.id);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações principais */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(athlete.membership.status)}`}>
                {athlete.membership.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Nível</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getFitnessLevelColor(athlete.healthInfo.fitnessLevel)}`}>
                {athlete.healthInfo.fitnessLevel === 'beginner' ? 'Iniciante' : 
                 athlete.healthInfo.fitnessLevel === 'intermediate' ? 'Intermédio' : 'Avançado'}
              </span>
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progresso Geral</span>
                <span className="font-medium">{athlete.metrics.progress.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${athlete.metrics.progress.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Frequência</span>
                <span className="font-medium">{athlete.metrics.attendance.percentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${athlete.metrics.attendance.percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Informações de contacto */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <a 
                href={`tel:${athlete.personalInfo.phone}`}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a 
                href={`mailto:${athlete.personalInfo.email}`}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            
            <div className="text-xs text-gray-500">
              Sequência: {athlete.metrics.attendance.streak || 0} dias
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho da página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Atletas</h1>
        <p className="text-gray-600">Gerir os seus clientes e acompanhar progressos</p>
      </div>

      {/* Estatísticas */}
      <StatisticsHeader />

      {/* Pesquisa e filtros */}
      <SearchAndFilters />

      {/* Lista de atletas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedAthletes.length > 0 ? (
          filteredAndSortedAthletes.map(athlete => (
            <AthleteCard 
              key={athlete.id} 
              athlete={athlete}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum atleta encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Tente ajustar os filtros de pesquisa.' 
                  : 'Comece adicionando o seu primeiro atleta.'
                }
              </p>
              {(!searchTerm && selectedFilter === 'all') && (
                <div className="mt-6">
                  <button
                    onClick={onAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Atleta
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rodapé com informações */}
      {filteredAndSortedAthletes.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          A mostrar {filteredAndSortedAthletes.length} de {athletes.length} atletas
        </div>
      )}
    </div>
  );
};

export default AthleteList;