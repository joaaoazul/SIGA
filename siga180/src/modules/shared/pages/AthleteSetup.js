// src/modules/shared/pages/AthleteSetup.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../services/supabase/supabaseClient';
import inviteService from '../../../services/supabase/inviteService.js';
import { 
  User, Mail, Phone, Calendar, Target, Activity, 
  AlertCircle, CheckCircle, Lock, Loader2, 
  ChevronRight, ChevronLeft, Heart, Scale, Ruler
} from 'lucide-react';
import toast from 'react-hot-toast';

const AthleteSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invite, setInvite] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1 - Conta
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2 - Dados Pessoais  
    name: '',
    phone: '',
    birth_date: '',
    gender: '',
    
    // Step 3 - Dados Físicos
    height: '',
    weight: '',
    activity_level: '',
    
    // Step 4 - Objetivos
    goals: [],
    medical_conditions: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  // Handler para inputs 
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Verificar token do convite
  useEffect(() => {
    const verifyInvite = async () => {
      console.log('🔍 Verificando token:', token);
      
      if (!token) {
        toast.error('Link de convite inválido');
        navigate('/login');
        return;
      }

      try {
        const validation = await inviteService.validateInviteToken(token);
        
        if (!validation.valid) {
          toast.error(validation.error || 'Convite inválido');
          navigate('/login');
          return;
        }

        console.log('✅ Convite válido:', validation.invite);
        setInvite(validation.invite);
        setFormData(prev => ({
          ...prev,
          email: validation.invite.athlete_email,
          name: validation.invite.athlete_name
        }));
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Erro ao verificar convite:', err);
        toast.error('Erro ao processar convite');
        navigate('/login');
      }
    };

    verifyInvite();
  }, [token, navigate]);

  // Validação por step
  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!formData.password) {
          newErrors.password = 'Password é obrigatória';
        } else if (formData.password.length < 6) {
          newErrors.password = 'Password deve ter pelo menos 6 caracteres';
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords não coincidem';
        }
        break;

      case 2:
        if (!formData.name.trim()) {
          newErrors.name = 'Nome completo é obrigatório';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Telefone é obrigatório';
        }
        if (!formData.birth_date) {
          newErrors.birth_date = 'Data de nascimento é obrigatória';
        }
        if (!formData.gender) {
          newErrors.gender = 'Género é obrigatório';
        }
        break;

      case 3:
        if (!formData.height || formData.height <= 0) {
          newErrors.height = 'Altura é obrigatória';
        }
        if (!formData.weight || formData.weight <= 0) {
          newErrors.weight = 'Peso atual é obrigatório';
        }
        if (!formData.activity_level) {
          newErrors.activity_level = 'Nível de atividade é obrigatório';
        }
        break;

      case 4:
        if (formData.goals.length === 0) {
          newErrors.goals = 'Selecione pelo menos um objetivo';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegação entre steps
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Toggle objetivo
  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  // Calcular idade
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // SUBMETER FORMULÁRIO
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      console.log('🚀 Iniciando criação de conta...');
      
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'athlete'
          }
        }
      });

      if (authError) {
        console.error('❌ Erro no signup:', authError);
        throw authError;
      }

      console.log('✅ Conta criada:', authData.user.id);

      // 2. AGUARDAR O TRIGGER CRIAR O PERFIL
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Atualizar o perfil existente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          birth_date: formData.birth_date,
          gender: formData.gender,
          height: parseInt(formData.height),
          weight: parseFloat(formData.weight),
          activity_level: formData.activity_level,
          goals: formData.goals,
          medical_conditions: formData.medical_conditions,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
          trainer_id: invite.trainer_id,
          setup_complete: true,
          profile_complete: true
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('❌ Erro ao atualizar perfil:', profileError);
        // Tentar criar se não existir
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            role: 'athlete',
            phone: formData.phone,
            birth_date: formData.birth_date,
            gender: formData.gender,
            height: parseInt(formData.height),
            weight: parseFloat(formData.weight),
            activity_level: formData.activity_level,
            goals: formData.goals,
            medical_conditions: formData.medical_conditions,
            emergency_contact: formData.emergency_contact,
            emergency_phone: formData.emergency_phone,
            trainer_id: invite.trainer_id,
            setup_complete: true,
            profile_complete: true
          });
          
        if (insertError) throw insertError;
      }

      console.log('✅ Perfil atualizado');

      // 4. Criar entrada na tabela athletes
      const { error: athleteError } = await supabase
        .from('athletes')
        .insert({
          profile_id: authData.user.id,
          trainer_id: invite.trainer_id,
          age: calculateAge(formData.birth_date),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          goal: formData.goals[0] || 'general',
          activity_level: formData.activity_level
        });

      if (athleteError) {
        console.error('⚠️ Aviso: Erro ao criar athlete:', athleteError);
      }

      // 5. Aceitar o convite
      const { error: inviteError } = await supabase
        .from('invites')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: authData.user.id
        })
        .eq('id', invite.id);

      if (inviteError) {
        console.error('⚠️ Aviso: Erro ao aceitar convite:', inviteError);
      }

      toast.success('Conta criada com sucesso! 🎉');
      
      // 6. Fazer login automático
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (!signInError) {
        console.log('✅ Login automático realizado');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        console.log('⚠️ Login automático falhou, redirecionando para login');
        navigate('/login');
      }

    } catch (error) {
      console.error('❌ Erro ao criar conta:', error);
      
      let errorMessage = 'Erro ao criar conta. ';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está registado';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Email inválido';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Password deve ter pelo menos 6 caracteres';
      } else {
        errorMessage += error.message || 'Tente novamente';
      }
      
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Componentes de cada Step
  const Step1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Criar a sua conta</h3>
      <p className="text-sm text-gray-600">Defina a sua password para aceder à plataforma</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Repita a password"
          />
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
      <p className="text-sm text-gray-600">Informações básicas sobre si</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+351 912 345 678"
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={formData.birth_date}
            onChange={handleInputChange('birth_date')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.birth_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.birth_date && <p className="text-xs text-red-500 mt-1">{errors.birth_date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
        <select
          value={formData.gender}
          onChange={handleInputChange('gender')}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
            errors.gender ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione...</option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
        {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Dados Físicos</h3>
      <p className="text-sm text-gray-600">Informações sobre o seu corpo e atividade</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
          <div className="relative">
            <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={formData.height}
              onChange={handleInputChange('height')}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.height ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="175"
            />
          </div>
          {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Peso Atual (kg)</label>
          <div className="relative">
            <Scale className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={handleInputChange('weight')}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.weight ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="75.5"
            />
          </div>
          {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Atividade</label>
        <div className="relative">
          <Activity className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={formData.activity_level}
            onChange={handleInputChange('activity_level')}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
              errors.activity_level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
            <option value="light">Ligeiramente ativo (1-3 dias/semana)</option>
            <option value="moderate">Moderadamente ativo (3-5 dias/semana)</option>
            <option value="active">Muito ativo (6-7 dias/semana)</option>
            <option value="extra">Extra ativo (atleta profissional)</option>
          </select>
        </div>
        {errors.activity_level && <p className="text-xs text-red-500 mt-1">{errors.activity_level}</p>}
      </div>
    </div>
  );

  const Step4 = () => {
    const goalOptions = [
      { id: 'weight_loss', label: 'Perder peso', icon: '🎯' },
      { id: 'muscle_gain', label: 'Ganhar massa muscular', icon: '💪' },
      { id: 'maintenance', label: 'Manutenção', icon: '⚖️' },
      { id: 'performance', label: 'Melhorar performance', icon: '🏃' },
      { id: 'health', label: 'Saúde geral', icon: '❤️' }
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Objetivos e Informações Médicas</h3>
        <p className="text-sm text-gray-600">Ajude-nos a personalizar o seu plano</p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos (selecione um ou mais)</label>
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map(goal => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.goals.includes(goal.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{goal.icon}</span>
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.goals && <p className="text-xs text-red-500 mt-1">{errors.goals}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condições Médicas (opcional)
          </label>
          <textarea
            value={formData.medical_conditions}
            onChange={handleInputChange('medical_conditions')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            rows="2"
            placeholder="Ex: Diabetes, hipertensão, lesões..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto de Emergência (opcional)
            </label>
            <input
              type="text"
              value={formData.emergency_contact}
              onChange={handleInputChange('emergency_contact')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nome do contacto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone de Emergência (opcional)
            </label>
            <input
              type="tel"
              value={formData.emergency_phone}
              onChange={handleInputChange('emergency_phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="+351 912 345 678"
            />
          </div>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">A verificar o seu convite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao SIGA180!</h1>
          <p className="text-gray-600">
            Complete o seu perfil para começar
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-full h-1 mx-2 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
            {currentStep === 4 && <Step4 />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center"
              >
                Próximo
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    A criar conta...
                  </>
                ) : (
                  <>
                    Criar Conta
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mensagem do Trainer */}
        {invite?.invite_message && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start">
              <Heart className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Mensagem do seu trainer:</h4>
                <p className="text-gray-600 italic">"{invite.invite_message}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteSetup;