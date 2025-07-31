import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Custom Hook
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Individual Toast Component
function Toast({ message, type, onClose }) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${getTypeStyles()}
      `}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Toast utility object (alternativa ao padrão anterior)
export const toast = {
  success: (message, duration) => {
    // Esta função será preenchida quando o componente for montado
    console.warn('Toast not initialized. Wrap your app with ToastProvider.');
  },
  error: (message, duration) => {
    console.warn('Toast not initialized. Wrap your app with ToastProvider.');
  },
  warning: (message, duration) => {
    console.warn('Toast not initialized. Wrap your app with ToastProvider.');
  },
  info: (message, duration) => {
    console.warn('Toast not initialized. Wrap your app with ToastProvider.');
  }
};

// Hook para usar o toast de forma imperativa
export function useImperativeToast() {
  const { addToast } = useToast();

  // Atualiza o objeto toast com as funções corretas
  toast.success = (message, duration) => addToast(message, 'success', duration);
  toast.error = (message, duration) => addToast(message, 'error', duration);
  toast.warning = (message, duration) => addToast(message, 'warning', duration);
  toast.info = (message, duration) => addToast(message, 'info', duration);

  return toast;
}