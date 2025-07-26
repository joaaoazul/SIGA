import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

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
          </AthleteProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;