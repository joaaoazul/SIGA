// siga180/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './modules/shared/hooks/useAuth';
import { AppRouter } from './routes/AppRouter';

// Import opcional do NotificationWorker
let notificationWorker = null;
try {
  notificationWorker = require('./services/notifications/notificationWorker').default;
} catch (e) {
  console.log('NotificationWorker não encontrado - sistema de emails funcionará sem worker automático');
}

function App() {
  useEffect(() => {
    // Só tenta iniciar se o worker existir
    if (!notificationWorker) return;

    const shouldStart = 
      process.env.NODE_ENV === 'production' || 
      process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true';

    if (shouldStart) {
      console.log('🚀 NotificationWorker ativado');
      notificationWorker.start();

      return () => {
        notificationWorker.stop();
      };
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;