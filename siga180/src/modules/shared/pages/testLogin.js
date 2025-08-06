import React, { useState } from 'react';
import authService from '../../../services/supabase/authServiceFixed';

const TestLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);
    
    console.log('🧪 Iniciando teste de login...');
    
    const response = await authService.signIn(email, password);
    
    console.log('📊 Resultado:', response);
    setResult(response);
    setLoading(false);
  };

  const handleTestLogout = async () => {
    await authService.signOut();
    setResult({ success: true, message: 'Logout efectuado' });
  };

  const handleCheckSession = async () => {
    const response = await authService.getCurrentUser();
    console.log('📊 Sessão atual:', response);
    setResult(response);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Teste de Autenticação</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            marginBottom: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          onClick={handleTestLogin}
          disabled={loading || !email || !password}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading || !email || !password ? 0.5 : 1
          }}
        >
          {loading ? 'Testando...' : 'Testar Login'}
        </button>
        
        <button 
          onClick={handleCheckSession}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Verificar Sessão
        </button>
        
        <button 
          onClick={handleTestLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {result && (
        <div style={{
          padding: '1rem',
          backgroundColor: result.success ? '#d1fae5' : '#fee2e2',
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          <h4>{result.success ? '✅ Sucesso' : '❌ Erro'}</h4>
          <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#fef3c7',
        borderRadius: '4px'
      }}>
        <h4>📝 Notas de Teste:</h4>
        <ul style={{ fontSize: '0.875rem' }}>
          <li>Verifica a consola para logs detalhados</li>
          <li>O serviço tem múltiplas estratégias de fallback</li>
          <li>Se falhar, tenta fazer reset à password</li>
          <li>Confirma que o email está em minúsculas</li>
        </ul>
      </div>
    </div>
  );
};

export default TestLogin;