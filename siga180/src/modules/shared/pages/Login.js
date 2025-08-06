// siga180/src/modules/shared/pages/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  Loader2,
  Info,
  Sparkles
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn } = useAuth(); // Adicionar user para verificar se já está logado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'success'
  
  // Check for invite parameters
  const inviteEmail = searchParams.get('email');
  const inviteToken = searchParams.get('token');
  const isFromInvite = searchParams.get('from') === 'invite';

  // Se já estiver logado, redirecionar baseado no role
  useEffect(() => {
    if (user && !loading) {
      console.log('🔄 User already logged in, redirecting based on role:', user.role);
      
      // Redirecionar baseado no role
      switch(user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        case 'athlete':
          navigate('/athlete/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Se vem de um convite, pré-preencher email
    if (inviteEmail) {
      setEmail(inviteEmail);
    }
    
    // Se tem token de convite, redirecionar para athlete-setup
    if (inviteToken) {
      navigate(`/athlete-setup?token=${inviteToken}`);
    }
  }, [inviteEmail, inviteToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🔐 Tentando fazer login com:', email);

    try {
      // Verificar se é um atleta convidado tentando fazer primeiro login
      if (isFromInvite) {
        // Verificar se o convite existe e está pendente
        const { data: inviteCheck } = await supabase
          .from('invites')
          .select('*')
          .eq('athlete_email', email.trim())
          .eq('status', 'pending')
          .single();

        if (inviteCheck) {
          toast.error('Por favor, complete o setup primeiro através do link no seu email.');
          setLoading(false);
          return;
        }
      }

      // Usar o hook useAuth para fazer login
      const { data, error } = await signIn(email.trim(), password);

      if (error) {
        console.error('❌ Login error:', error);
        
        // Tratamento específico de erros
        if (error.message?.includes('Invalid login credentials')) {
          toast.error('Email ou password incorretos');
        } else if (error.message?.includes('Email not confirmed')) {
          toast.error('Por favor, confirme o seu email antes de fazer login');
        } else {
          toast.error(error.message || 'Erro ao fazer login');
        }
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      console.log('✅ Login successful!');
      toast.success('Login realizado com sucesso!');
      
      // O useEffect acima vai detectar a mudança no user e redirecionar automaticamente
      // Não precisamos fazer nada aqui
      
    } catch (error) {
      console.error('❌ Login exception:', error);
      toast.error('Erro inesperado. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        if (error.message.includes('User not found')) {
          toast.error('Email não encontrado');
        } else {
          toast.error(error.message);
        }
      } else {
        setMode('success');
        toast.success('Email de recuperação enviado!');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = () => {
    const token = prompt('Cole aqui o seu link de convite:');
    if (token) {
      // Extrair token do URL se necessário
      const match = token.match(/token=([^&]+)/);
      if (match) {
        navigate(`/athlete-setup?token=${match[1]}`);
      } else if (token.includes('/athlete-setup')) {
        // Se colou o URL completo
        try {
          const url = new URL(token);
          navigate(url.pathname + url.search);
        } catch {
          toast.error('Link de convite inválido');
        }
      } else {
        toast.error('Link de convite inválido');
      }
    }
  };

  // Modo de sucesso (recuperação de password)
  if (mode === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Email Enviado!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Enviámos instruções de recuperação para<br />
              <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Não recebeu o email? Verifique a pasta de spam.
            </p>
            <button
              onClick={() => setMode('login')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">SIGA180</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão para Personal Trainers</p>
        </div>

        {/* Invite Alert - Apenas se vem de convite */}
        {isFromInvite && (
          <div className="mb-4 bg-white border border-green-200 rounded-lg p-3 flex items-center">
            <Sparkles className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-sm text-gray-700">
              Foi convidado para o SIGA180. Faça login para continuar.
            </p>
          </div>
        )}

        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Entrar na sua conta
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                  readOnly={isFromInvite}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Esqueceu a password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Magic Link Button - Discreto */}
            {!isFromInvite && (
              <button
                type="button"
                onClick={handleMagicLink}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Tenho um link de convite
              </button>
            )}
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Primeira vez?</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• <strong>Personal Trainers:</strong> Use as credenciais fornecidas</li>
                  <li>• <strong>Atletas:</strong> Use o link enviado pelo seu trainer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Problemas com o login? Contacte o suporte.
        </p>
      </div>
    </div>
  );
};

export default Login;