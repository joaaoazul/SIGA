// =============================================
// AdminLayout.js - src/modules/admin/components/AdminLayout.js
// =============================================

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import SystemAlert from './SystemAlert';
import { useAuth } from '../../shared/hooks/useAuth';
import { Shield } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false); // Começa false
  const { user } = useAuth();

  // Verificar se é admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">
            Não tem permissões para aceder ao painel de administração.
          </p>
          <p className="text-sm text-gray-500">
            Se acredita que isto é um erro, contacte o administrador do sistema.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* System Alerts - Opcional */}
          {showMaintenanceAlert && (
            <div className="px-6 pt-4">
              <SystemAlert
                type="warning"
                title="Manutenção Agendada"
                message="Está agendada uma manutenção para dia 10 de Fevereiro às 23:00."
                onClose={() => setShowMaintenanceAlert(false)}
                actions={[
                  {
                    label: 'Ver Detalhes',
                    onClick: () => console.log('Ver detalhes'),
                    primary: true
                  },
                  {
                    label: 'Ignorar',
                    onClick: () => setShowMaintenanceAlert(false)
                  }
                ]}
              />
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;