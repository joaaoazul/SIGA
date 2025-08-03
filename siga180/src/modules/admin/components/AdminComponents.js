// =============================================
// AdminComponents.js - src/modules/admin/components/AdminComponents.js
// Todos os componentes num único ficheiro para facilitar
// =============================================

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Server,
  Plus, 
  Download, 
  Mail, 
  RefreshCw,
  FileText,
  Database
} from 'lucide-react';

// AdminStatsCard Component
export const AdminStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false 
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trendValue && (
              <div className={`flex items-center ml-2 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">{trendValue}%</span>
              </div>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// RecentActivityWidget
export const RecentActivityWidget = ({ activities = [] }) => {
  const defaultActivities = [
    { id: 1, user: 'João Silva', action: 'Login', time: '5 min atrás', type: 'success' },
    { id: 2, user: 'Maria Santos', action: 'Criou plano', time: '15 min atrás', type: 'info' },
    { id: 3, user: 'Pedro Costa', action: 'Atualizou perfil', time: '1 hora atrás', type: 'warning' },
    { id: 4, user: 'Ana Ferreira', action: 'Completou treino', time: '2 horas atrás', type: 'success' }
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
      <div className="space-y-3">
        {items.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3">
            {getIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// SystemStatusWidget
export const SystemStatusWidget = () => {
  const services = [
    { name: 'Base de Dados', status: 'online', latency: '12ms' },
    { name: 'API', status: 'online', latency: '45ms' },
    { name: 'Storage', status: 'online', latency: '23ms' },
    { name: 'Email', status: 'warning', latency: '120ms' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Server className="h-5 w-5 mr-2" />
        Status do Sistema
      </h3>
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                service.status === 'online' ? 'bg-green-500' :
                service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-700">{service.name}</span>
            </div>
            <span className="text-xs text-gray-500">{service.latency}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Uptime</span>
          <span className="font-medium text-green-600">99.98%</span>
        </div>
      </div>
    </div>
  );
};

// QuickMetricsWidget
export const QuickMetricsWidget = ({ metrics }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas do Dia</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Novos Registos</p>
          <p className="text-2xl font-bold text-gray-900">
            {metrics?.newRegistrations || 12}
          </p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +23% vs ontem
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Sessões Ativas</p>
          <p className="text-2xl font-bold text-gray-900">
            {metrics?.activeSessions || 47}
          </p>
          <p className="text-xs text-red-600 flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            -5% vs ontem
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Planos Criados</p>
          <p className="text-2xl font-bold text-gray-900">
            {metrics?.plansCreated || 8}
          </p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +15% vs ontem
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Taxa Conclusão</p>
          <p className="text-2xl font-bold text-gray-900">
            {metrics?.completionRate || '84%'}
          </p>
          <p className="text-xs text-gray-600 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Média semanal
          </p>
        </div>
      </div>
    </div>
  );
};

// AdminQuickActions
export const AdminQuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Criar Admin',
      description: 'Adicionar novo administrador',
      color: 'red',
      onClick: () => console.log('Criar admin')
    },
    {
      icon: Download,
      label: 'Backup BD',
      description: 'Fazer backup da base de dados',
      color: 'blue',
      onClick: () => console.log('Backup')
    },
    {
      icon: Mail,
      label: 'Email em Massa',
      description: 'Enviar email para todos',
      color: 'green',
      onClick: () => console.log('Email')
    },
    {
      icon: FileText,
      label: 'Gerar Relatório',
      description: 'Relatório mensal completo',
      color: 'purple',
      onClick: () => console.log('Relatório')
    },
    {
      icon: Database,
      label: 'Limpar Cache',
      description: 'Limpar cache do sistema',
      color: 'orange',
      onClick: () => console.log('Cache')
    },
    {
      icon: RefreshCw,
      label: 'Sync Dados',
      description: 'Sincronizar dados externos',
      color: 'indigo',
      onClick: () => console.log('Sync')
    }
  ];

  const colorClasses = {
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                p-4 rounded-lg transition-all duration-200
                ${colorClasses[action.color]}
                flex flex-col items-center text-center
                hover:shadow-md
              `}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="font-medium text-sm">{action.label}</span>
              <span className="text-xs opacity-75 mt-1">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};