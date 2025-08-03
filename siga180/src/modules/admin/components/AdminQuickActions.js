import { 
  Plus, 
  Download, 
  Upload, 
  Mail, 
  Shield as ShieldIcon,
  RefreshCw,
  FileText,
  Database as DatabaseIcon
} from 'lucide-react';

const AdminQuickActions = () => {
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
      icon: DatabaseIcon,
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

export default AdminQuickActions;
