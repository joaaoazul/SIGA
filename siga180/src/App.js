// siga180/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './modules/shared/hooks/useAuth';
import { AppRouter } from './routes/AppRouter';

function App() {
  useEffect(() => {
    let workerInstance = null;
    let workerStarted = false;
    let isUnmounted = false;

    const loadWorker = async () => {
      try {
        const module = await import('./services/notifications/notificationWorker');
        workerInstance = module?.default;

        if (!workerInstance) {
          return;
        }

        const shouldStart =
          process.env.NODE_ENV === 'production' ||
          process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true';

        if (shouldStart && !isUnmounted) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('🚀 NotificationWorker ativado');
          }
          workerInstance.start?.();
          workerStarted = true;
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.info('NotificationWorker não encontrado ou falhou ao carregar.', error);
        }
      }
    };

    loadWorker();

    return () => {
      isUnmounted = true;
      if (workerInstance && workerStarted && typeof workerInstance.stop === 'function') {
        workerInstance.stop();
      }
    };
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