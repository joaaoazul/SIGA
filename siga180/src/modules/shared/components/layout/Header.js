// =============================================
// Header.js - src/modules/shared/components/layout/Header.js
// Header Funcional com Logout e Navegação
// =============================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User,
  ChevronDown,
  Menu,
  X,
  Home,
  Dumbbell,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Novo atleta aceitou o convite', time: '5 min', unread: true },
    { id: 2, text: 'João completou o treino', time: '1h', unread: true },
    { id: 3, text: 'Maria enviou uma mensagem', time: '2h', unread: false }
  ]);
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar busca
      console.log('Buscar por:', searchQuery);
      toast.info(`Buscando: ${searchQuery}`);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
    toast.success('Notificações limpas');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Obter nome e iniciais do usuário
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const userRole = user?.role === 'trainer' ? 'Personal Trainer' : 'Atleta';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu toggle & Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-[#333333] hover:bg-[#E8ECE3] transition-colors lg:hidden"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center ml-4 lg:ml-0">
              <Dumbbell className="h-8 w-8 text-[#333333]" />
              <span className="ml-2 text-xl font-bold text-[#333333]">180 by Binho</span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar atletas, treinos..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent transition-all"
              />
            </form>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Search mobile */}
            <button className="p-2 rounded-lg text-gray-600 hover:text-[#333333] hover:bg-[#E8ECE3] transition-colors md:hidden">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-600 hover:text-[#333333] hover:bg-[#E8ECE3] transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#333333]">Notificações</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-gray-500 hover:text-[#333333]"
                        >
                          Limpar tudo
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notif.unread ? 'bg-[#E8ECE3] bg-opacity-20' : ''
                          }`}
                        >
                          <p className="text-sm text-[#333333]">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time} atrás</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Sem notificações</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg text-gray-600 hover:text-[#333333] hover:bg-[#E8ECE3] transition-colors hidden sm:block"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile Menu */}
            <div className="relative ml-2" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#E8ECE3] transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#333333] to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {userInitials}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-[#333333]">{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-[#333333]">{userName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 sm:hidden"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </button>

                  {user?.role === 'trainer' && (
                    <button
                      onClick={() => {
                        navigate('/billing');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Faturação</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('/help');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Ajuda</span>
                  </button>

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;