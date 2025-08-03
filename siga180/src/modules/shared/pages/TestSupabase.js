// src/modules/shared/pages/TestSupabase.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase/supabaseClient';

const TestSupabase = () => {
  const [status, setStatus] = useState('loading');
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testSupabase();
  }, []);

  const testSupabase = async () => {
    try {
      // Teste 1: Verificar conexão
      const { data, error } = await supabase
        .from('profiles')
        .select('count');
      
      if (error) throw error;
      
      setStatus('connected');
      console.log('✅ Conexão OK:', data);
      
      // Teste 2: Buscar perfis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
        
      if (profilesError) throw profilesError;
      
      setProfiles(profilesData);
      
    } catch (err) {
      console.error('❌ Erro:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teste de Conexão Supabase</h1>
      
      {/* Status */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Status da Conexão:</h2>
        {status === 'loading' && <p className="text-blue-600">🔄 A conectar...</p>}
        {status === 'connected' && <p className="text-green-600">✅ Conectado com sucesso!</p>}
        {status === 'error' && (
          <div>
            <p className="text-red-600">❌ Erro de conexão</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
        )}
      </div>
      
      {/* Dados */}
      {profiles && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Perfis encontrados: {profiles.length}</h2>
          {profiles.length === 0 ? (
            <p className="text-gray-600">Nenhum perfil na base de dados ainda.</p>
          ) : (
            <ul className="space-y-2">
              {profiles.map(profile => (
                <li key={profile.id} className="border-b pb-2">
                  <p className="font-medium">{profile.name || 'Sem nome'}</p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Next Steps */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">✅ Próximos Passos:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Supabase está conectado e funcional</li>
          <li>Agora podemos implementar o sistema de auth</li>
          <li>Criar a página de admin para criar trainers</li>
          <li>Implementar o sistema de convites</li>
        </ol>
      </div>
    </div>
  );
};

export default TestSupabase;