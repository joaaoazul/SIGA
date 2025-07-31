import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AppProvider } from './modules/shared/context/AppContext';
import { AthleteProvider } from './modules/shared/context/AthleteContext';
import { AuthProvider } from './modules/shared/hooks/useAuth';

// Router
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AthleteProvider>
            <AppRouter />
            
            {/* Toast Notifications - Design Clean */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{
                top: 20,
              }}
              toastOptions={{
                // Duração padrão
                duration: 4000,
                
                // Estilos padrão para todos os toasts
                className: '',
                style: {
                  background: '#fff',
                  color: '#363636',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '14px',
                  maxWidth: '500px',
                },
                
                // Estilos específicos por tipo
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#fff',
                    color: '#065F46',
                    border: '1px solid #D1FAE5',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#fff',
                    color: '#991B1B',
                    border: '1px solid #FEE2E2',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#3B82F6',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#fff',
                    color: '#1E40AF',
                    border: '1px solid #DBEAFE',
                  },
                },
                // Custom styled toasts
                custom: {
                  style: {
                    background: '#fff',
                    color: '#363636',
                  },
                },
              }}
            />
          </AthleteProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;