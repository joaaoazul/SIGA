import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Dumbbell,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'success'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Substituir por: await signIn(formData.email, formData.password);
      console.log('Login com:', formData);
      
      // Simular sucesso
      setTimeout(() => {
        setLoading(false);
        alert('Login realizado com sucesso!');
        // navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Substituir por: await supabase.auth.resetPasswordForEmail(formData.email)
      console.log('Recuperar password para:', formData.email);
      
    // Simular envio
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Simular sucesso
    setTimeout(() => {
      setLoading(false);
      setMode('success');
    }, 2000);
  } catch (error) {
    console.error('Password reset error:', error);
    setLoading(false);
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
            <div className="inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-sm mb-4">
              <Dumbbell className="h-8 w-8 text-[#333333]" />
            </div>
            <h1 className="text-3xl font-bold text-[#333333]">
              180 Performance
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login' && 'Bem-vindo de volta! Entre na sua conta.'}
              {mode === 'forgot' && 'Recupere o acesso à sua conta.'}
              {mode === 'success' && 'Verifique o seu email.'}
            </p>
          </div>

          {/* Form */}
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
                    <strong>{formData.email}</strong>
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && !formData.password && mode === 'login' ? null : e.key === 'Enter' && (mode === 'login' ? handleSubmit(e) : handleForgotPassword(e))}
                        className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        className="appearance-none block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Remember me and Forgot password with animation */}
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
                      onClick={mode === 'login' ? handleSubmit : handleForgotPassword}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:block lg:w-96 bg-[#333333] relative overflow-hidden">
        {/* Dense Dumbbell Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -inset-20 grid grid-cols-12 gap-4 rotate-45">
            {[...Array(240)].map((_, i) => (
              <Dumbbell key={i} className="h-8 w-8 text-white" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;