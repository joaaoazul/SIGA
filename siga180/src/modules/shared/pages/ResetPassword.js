// =============================================
// ResetPassword.js - src/modules/shared/pages/ResetPassword.js
// VERSÃO FINAL CORRIGIDA
// =============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase/supabaseClient';
import toast from 'react-hot-toast';
import { 
  Lock, 
  ArrowRight, 
  Loader2,
  Dumbbell,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Verificação da sessão
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Pequeno delay para garantir que o Supabase processou o URL
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verifica se tem uma sessão válida
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔍 Reset Password - Verificando sessão...');
        
        if (error || !session) {
          console.error('❌ Sem sessão válida para reset');
          toast.error('Link inválido ou expirado. Solicite um novo.');
          
          // Redireciona para login usando window.location
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        // Se chegou aqui, tem sessão válida
        console.log('✅ Sessão válida para reset password');
        setIsValidSession(true);
        
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        toast.error('Erro ao processar link de recuperação');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const validatePassword = () => {
    setError('');
    
    if (!formData.password) {
      setError('A password é obrigatória');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword()) return;
    
    setLoading(true);

    try {
      // Atualizar a password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: formData.password 
      });

      if (updateError) {
        console.error('Erro ao atualizar password:', updateError);
        setError(updateError.message || 'Erro ao atualizar password');
        toast.error('Erro ao atualizar password');
        setLoading(false);
        return;
      }

      // Sucesso!
      setSuccess(true);
      toast.success('Password atualizada com sucesso!');
      
      // Fazer logout completo para limpar a sessão
      await supabase.auth.signOut();
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        // Usar window.location para garantir reload completo
        window.location.href = '/login';
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao atualizar password:', error);
      setError('Erro ao atualizar password. Tente novamente.');
      toast.error('Erro ao atualizar password');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro quando user digita
    if (error) setError('');
  };

  // Loading enquanto verifica sessão
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#E8ECE3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#333333]" />
          <p className="text-gray-600">A verificar link...</p>
        </div>
      </div>
    );
  }

  // Se não tem sessão válida, não mostra nada (já redirecionou)
  if (!isValidSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#E8ECE3] flex">
      {/* Left Side - Reset Form */}
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
              {!success ? 'Defina a sua nova password' : 'Password atualizada com sucesso!'}
            </p>
          </div>

          {/* Form */}
          <div className="mt-8">
            <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-200">
              {success ? (
                // Success State
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-[#333333] mb-2">
                    Password Atualizada!
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    A sua password foi atualizada com sucesso.
                    <br />
                    Vai ser redirecionado para o login...
                  </p>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A redirecionar...
                  </div>
                </div>
              ) : (
                // Form State
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
                      Nova Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Mínimo 6 caracteres
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333333]">
                      Confirmar Nova Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        className="appearance-none block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !formData.password || !formData.confirmPassword}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#333333] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          A atualizar...
                        </>
                      ) : (
                        <>
                          Atualizar Password
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <a
                      href="/login"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Voltar ao login
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Pattern */}
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

export default ResetPassword;