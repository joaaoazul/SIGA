// src/pages/auth/Setup.js
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase/supabaseClient';
import toast from 'react-hot-toast';

const Setup = ({ onSetupComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // Dados profissionais
    businessName: 'SIGA180 Personal Training',
    specialties: [],
    experience: '',
    certifications: '',
    
    // Configurações
    timezone: 'Europe/Lisbon',
    currency: 'EUR',
    language: 'pt-PT'
  });

  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      // Verificar se já existe um trainer
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'trainer')
        .limit(1);
      
      if (profiles && profiles.length > 0) {
        // Já existe um trainer, redirecionar para login
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Error checking setup:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'trainer'
          }
        }
      });

      if (authError) throw authError;

      // 2. Criar perfil completo
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          role: 'trainer',
          business_name: formData.businessName,
          specialties: formData.specialties,
          experience: formData.experience,
          certifications: formData.certifications,
          settings: {
            timezone: formData.timezone,
            currency: formData.currency,
            language: formData.language
          }
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // 3. Criar configurações iniciais
      await createInitialSettings(authData.user.id);

      // Notificar que o setup foi concluído
      if (onSetupComplete) {
        onSetupComplete();
      }

      toast.success('Configuração concluída com sucesso!');
      navigate('/trainer/dashboard');
      
    } catch (error) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Erro na configuração');
    } finally {
      setLoading(false);
    }
  };

  const createInitialSettings = async (trainerId) => {
    // Criar categorias de exercícios padrão
    const defaultCategories = [
      'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps',
      'Pernas', 'Core', 'Cardio', 'Mobilidade'
    ];

    for (const category of defaultCategories) {
      await supabase
        .from('exercise_categories')
        .insert({
          name: category,
          trainer_id: trainerId
        });
    }

    // Criar templates de planos
    await supabase
      .from('plan_templates')
      .insert([
        {
          name: 'Iniciante - 3x Semana',
          trainer_id: trainerId,
          description: 'Plano básico para iniciantes',
          weeks: 4
        },
        {
          name: 'Hipertrofia - 4x Semana',
          trainer_id: trainerId,
          description: 'Foco em ganho de massa muscular',
          weeks: 8
        }
      ]);
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Configuração Inicial SIGA180
          </h1>
          <p className="text-gray-600 mt-2">
            Vamos configurar a sua conta de Personal Trainer
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
            `}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
            `}>
              2
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
            `}>
              3
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Dados de Acesso
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.email || !formData.password || formData.password !== formData.confirmPassword}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Próximo
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Dados Pessoais
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+351 912 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="h-4 w-4 inline mr-1" />
                  Certificações
                </label>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ex: CREF, Certificação em Nutrição Esportiva..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.name}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  Próximo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Confirmar e Finalizar
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                {formData.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  O que será configurado:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Sua conta de Personal Trainer</li>
                  <li>✓ Categorias de exercícios padrão</li>
                  <li>✓ Templates de planos de treino</li>
                  <li>✓ Configurações iniciais do sistema</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSetup}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Configurando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Finalizar Configuração
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Esta configuração só precisa ser feita uma vez.
          Depois poderá gerir tudo através do painel.
        </p>
      </div>
    </div>
  );
};

export default Setup;