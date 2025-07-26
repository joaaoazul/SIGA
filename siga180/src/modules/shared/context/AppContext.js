import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
  });

  const updateAppState = (updates) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification,
    };
    setAppState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification],
    }));
  };

  const removeNotification = (id) => {
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const toggleSidebar = () => {
    setAppState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen,
    }));
  };

  const value = {
    ...appState,
    updateAppState,
    addNotification,
    removeNotification,
    toggleSidebar,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;