// siga180/src/modules/shared/pages/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Dumbbell,
  CheckCircle,
  Info,
  Sparkles,
  UserPlus
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'success'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check for invite parameters
  const inviteEmail = searchParams.get('email');
  const inviteToken = searchParams.get('token');
  const isFromInvite = searchParams.get('from') === 'invite';

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log('🔄 User already logged in, redirecting based on role:', user.role);
      
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

  // Handle invite parameters
  useEffect(() => {
    if (inviteEmail) {
      setFormData(prev => ({ ...prev, email: inviteEmail }));
    }
    
    if (inviteToken) {
      navigate(`/athlete-setup?token=${inviteToken}`);
    }
  }, [inviteEmail, inviteToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🔐 Attempting login with:', formData.email);

    try {
      // Check if invited athlete trying first login
      if (isFromInvite) {
        const { data: inviteCheck } = await supabase
          .from('invites')
          .select('*')
          .eq('athlete_email', formData.email.trim())
          .eq('status', 'pending')
          .single();

        if (inviteCheck) {
          toast.error('Por favor, complete o setup primeiro através do link no seu email.');
          setLoading(false);
          return;
        }
      }

      // Login using auth hook
      const { data, error } = await signIn(formData.email.trim(), formData.password);

      if (error) {
        console.error('❌ Login error:', error);
        
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

      console.log('✅ Login successful!');
      toast.success('Login realizado com sucesso!');
      
      // The useEffect above will handle the redirect based on user role
      
    } catch (error) {
      console.error('❌ Login exception:', error);
      toast.error('Erro inesperado. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
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
      const match = token.match(/token=([^&]+)/);
      if (match) {
        navigate(`/athlete-setup?token=${match[1]}`);
      } else if (token.includes('/athlete-setup')) {
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

  const resetForm = () => {
    setMode('login');
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-[#E8ECE3] flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-4">
              <Dumbbell className="h-10 w-10 text-[#333333]" />
            </div>
            <h1 className="text-4xl font-bold text-[#333333]">
              180 Performance
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login' && 'Sistema de Gestão para Personal Trainers'}
              {mode === 'forgot' && 'Recupere o acesso à sua conta'}
              {mode === 'success' && 'Verifique o seu email'}
            </p>
          </div>

          {/* Invite Alert */}
          {isFromInvite && mode === 'login' && (
            <div className="mt-6 mb-4 bg-white/80 backdrop-blur border border-green-200 rounded-xl p-3 flex items-center">
              <Sparkles className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Foi convidado para o 180 Performance. Faça login para continuar.
              </p>
            </div>
          )}

          {/* Form Card */}
          <div className="mt-8">
            <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-200">
              {mode === 'success' ? (
                // Success State
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#333333] mb-2">
                    Email Enviado!
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Enviámos instruções de recuperação para<br />
                    <strong className="text-[#333333]">{formData.email}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Não recebeu o email? Verifique a pasta de spam.
                  </p>
                  <button
                    onClick={resetForm}
                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    Voltar ao login
                  </button>
                </div>
              ) : (
                // Form State
                <div className="space-y-6">
                  {mode === 'forgot' && (
                    <button
                      onClick={() => setMode('login')}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 -mb-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </button>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#333333]">
                      Email
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        readOnly={isFromInvite}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (mode === 'forgot') {
                              handleForgotPassword(e);
                            } else if (formData.email && formData.password) {
                              handleLogin(e);
                            }
                          }
                        }}
                        className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all read-only:bg-gray-100"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  {/* Password field with animation */}
                  <div className={`transition-all duration-300 ease-in-out ${
                    mode === 'forgot' ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-32 opacity-100'
                  }`}>
                    <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required={mode === 'login'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && formData.email && formData.password) {
                            handleLogin(e);
                          }
                        }}
                        className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className={`flex items-center justify-between transition-all duration-300 ${
                    mode === 'forgot' ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-10'
                  }`}>
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 bg-gray-50 border-gray-300 focus:ring-green-500 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-[#333333]">
                        Lembrar-me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        Esqueceu a password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={mode === 'login' ? handleLogin : handleForgotPassword}
                      disabled={loading || !formData.email || (mode === 'login' && !formData.password)}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#333333] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          {mode === 'login' ? 'A entrar...' : 'A enviar...'}
                        </>
                      ) : (
                        <>
                          {mode === 'login' ? 'Entrar' : 'Enviar instruções'}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Magic Link Button */}
                  {!isFromInvite && mode === 'login' && (
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Tenho um link de convite
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Info Box */}
            {mode === 'login' && (
              <div className="mt-6 bg-white/60 backdrop-blur border border-gray-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-[#333333] mb-1">Primeira vez?</p>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-1">•</span>
                        <span><strong>Personal Trainers:</strong> Use as credenciais fornecidas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-1">•</span>
                        <span><strong>Atletas:</strong> Use o link enviado pelo seu trainer</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Problemas com o login? <a href="#" className="text-green-600 hover:text-green-700 font-medium">Contacte o suporte</a>
          </p>
        </div>
      </div>

      {/* Right Side - Features Panel */}
      <div className="hidden lg:block lg:w-96 xl:w-[500px] bg-[#333333] relative overflow-hidden">
        {/* Dense Dumbbell Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -inset-20 grid grid-cols-12 gap-4 rotate-45">
            {[...Array(240)].map((_, i) => (
              <Dumbbell key={i} className="h-8 w-8 text-white" />
            ))}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-sm mx-auto text-center">
            <Dumbbell className="h-16 w-16 mx-auto mb-6 text-white/20" />
            <h2 className="text-3xl font-bold mb-4">
              Gestão Completa de Treino
            </h2>
            <p className="text-white/80 mb-8">
              Plataforma profissional para personal trainers gerirem atletas, planos de treino e acompanhamento de evolução.
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-white/90">Gestão de Atletas</p>
                  <p className="text-sm text-white/60">Perfis completos e acompanhamento personalizado</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-white/90">Planos de Treino</p>
                  <p className="text-sm text-white/60">Criação e gestão de programas personalizados</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-white/90">Tracking de Progresso</p>
                  <p className="text-sm text-white/60">Métricas e evolução em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
