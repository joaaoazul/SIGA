import React from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Server
} from 'lucide-react';

// Widget de Atividade Recente
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

// Widget de Status do Sistema
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

// Widget de Métricas Rápidas
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