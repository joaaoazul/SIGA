// src/modules/shared/pages/CreateAdmin.js
import React, { useState } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { Shield, Check, X } from 'lucide-react';

const CreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Criar utilizador
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'ADMIN'
          }
        }
      });

      if (authError) throw authError;

      // 2. Atualizar o perfil para ADMIN
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      setSuccess(true);
      setMessage('✅ Admin criado com sucesso! Verifica o teu email para confirmar.');
      
      // Limpar form
      setFormData({ email: '', password: '', name: '' });
      
    } catch (error) {
      console.error('Erro:', error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Criar Admin</h1>
          <p className="text-gray-600 mt-2">Configuração inicial do sistema</p>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="João Admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@siga180.pt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'A criar...' : 'Criar Conta Admin'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-md ${
            success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Atenção:</strong> Esta página deve ser removida após criar o primeiro admin!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;