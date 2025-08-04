// =============================================
// DebugAuth.js - src/modules/shared/components/DebugAuth.js
// =============================================

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DebugAuth = () => {
  const auth = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">🔍 Debug Auth</h3>
      <div className="space-y-1">
        <p>Loading: {auth.loading ? '⏳ SIM' : '✅ NÃO'}</p>
        <p>User: {auth.user ? `✅ ${auth.user.email}` : '❌ Null'}</p>
        <p>Role: {auth.user?.role || 'N/A'}</p>
        <p>Route: {window.location.pathname}</p>
      </div>
    </div>
  );
};

export default DebugAuth;