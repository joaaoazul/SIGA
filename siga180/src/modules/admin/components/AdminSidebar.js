
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  Activity,
  Shield,
  ChevronLeft,
  Database,
  Bell,
  FileText,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../modules/shared/hooks/useAuth';

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      badge: null
    },
    {
      name: 'Utilizadores',
      href: '/users',
      icon: Users,
      badge: 'new'
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Settings,
      badge: null
    },
    {
      name: 'Logs',
      href: '/logs',
      icon: Activity,
      badge: null
    },
    {
      type: 'separator'
    },
    {
      name: 'Base de Dados',
      href: '/database',
      icon: Database,
      badge: null
    },
    {
      name: 'Notificações',
      href: '/notifications',
      icon: Bell,
      badge: '3'
    },
    {
      name: 'Relatórios',
      href: '/reports',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Documentação',
      href: '/docs',
      icon: FileText,
      badge: null
    }
  ];

  const handleSignOut = async () => {
    if (window.confirm('Tem a certeza que deseja sair?')) {
      await signOut();
    }
  };

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      bg-gray-900 text-white h-screen 
      transition-all duration-300 ease-in-out
      flex flex-col
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <Shield className="h-8 w-8 text-red-500" />
            {!isCollapsed && (
              <span className="ml-2 text-xl font-bold">Admin</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="my-4 border-t border-gray-800" />;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`
                flex items-center px-3 py-2 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.name : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 flex-1">{item.name}</span>
                  {item.badge && (
                    <span className={`
                      ml-2 px-2 py-1 text-xs rounded-full
                      ${item.badge === 'new' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className={`
            flex items-center w-full px-3 py-2 rounded-lg
            text-gray-300 hover:bg-gray-800 hover:text-white
            transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Sair' : ''}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
