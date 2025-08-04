import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../modules/shared/hooks/useAuth';

// Componente de teste simples
const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Admin Dashboard
          </h1>
          
          <div className="mb-6">
            <p className="text-green-600 font-semibold text-lg mb-2">
              ✅ As rotas estão a funcionar!
            </p>
            <p className="text-gray-600">
              Se vês esta página, significa que:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li>O login funcionou</li>
              <li>A autenticação está OK</li>
              <li>As rotas admin carregaram</li>
              <li>O role está correto</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded p-4 mb-6">
            <h2 className="font-semibold mb-2">Informações do User:</h2>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>ID: {user?.id}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminRoutes = () => {
  console.log('🔴 AdminRoutes renderizado!');
  
  return (
    <Routes>
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};