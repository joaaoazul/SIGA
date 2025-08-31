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
  const [inviteData, setInviteData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    // Step 1 - Conta
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2 - Dados Pessoais
    name: '',
    phone: '',
    birthDate: '',
    gender: '',
    
    // Step 3 - Dados Físicos
    height: '',
    weight: '',
    activityLevel: 'moderate',
    
    // Step 4 - Objetivos
    goals: [],
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // Verificar convite
  useEffect(() => {
    const verifyInvite = async () => {
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

        setInviteData(validation.invite);
        setProfileData(prev => ({
          ...prev,
          email: validation.invite.athlete_email,
          name: validation.invite.athlete_name || ''
        }));
        
        setLoading(false);
      } catch (err) {
        console.error('Erro:', err);
        toast.error('Erro ao processar convite');
        navigate('/login');
      }
    };

    verifyInvite();
  }, [token, navigate]);

  // Validação
  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!profileData.password || profileData.password.length < 6) {
          newErrors.password = 'Password deve ter pelo menos 6 caracteres';
        }
        if (profileData.password !== profileData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords não coincidem';
        }
        break;
      
      case 2:
        if (!profileData.name?.trim()) {
          newErrors.name = 'Nome é obrigatório';
        }
        if (!profileData.birthDate) {
          newErrors.birthDate = 'Data de nascimento é obrigatória';
        }
        break;
      
      case 3:
        if (!profileData.height || profileData.height <= 0) {
          newErrors.height = 'Altura é obrigatória';
        }
        if (!profileData.weight || profileData.weight <= 0) {
          newErrors.weight = 'Peso é obrigatório';
        }
        break;
      
      case 4:
        if (profileData.goals.length === 0) {
          newErrors.goals = 'Selecione pelo menos um objetivo';
        }
        if (!profileData.emergencyContact?.trim()) {
          newErrors.emergencyContact = 'Contacto de emergência é obrigatório';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayToggle = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    
    try {
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profileData.email.trim(),
        password: profileData.password,
        options: {
          data: {
            name: profileData.name,
            role: 'athlete'
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('Erro ao criar conta');

      // 2. Criar/atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: profileData.email,
          name: profileData.name,
          phone: profileData.phone,
          birth_date: profileData.birthDate,
          gender: profileData.gender,
          height: profileData.height,
          weight: profileData.weight,
          activity_level: profileData.activityLevel,
          goals: profileData.goals,
          medical_conditions: profileData.medicalConditions ? [profileData.medicalConditions] : [],
          emergency_contact: profileData.emergencyContact,
          emergency_phone: profileData.emergencyPhone,
          role: 'athlete',
          setup_complete: true,
          profile_complete: true
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      }

      // 3. Aceitar convite
      if (token && inviteData) {
        await inviteService.acceptInvite(token, userId);
        
        // Criar relação com trainer
        const { error: relationError } = await supabase
          .from('athletes')
          .insert({
            profile_id: userId,
            trainer_id: inviteData.trainer_id,
            age: profileData.birthDate ? 
              new Date().getFullYear() - new Date(profileData.birthDate).getFullYear() : null,
            height: profileData.height,
            weight: profileData.weight,
            goal: profileData.goals[0] || null,
            activity_level: profileData.activityLevel
          });

        if (relationError) {
          console.error('Erro ao criar relação:', relationError);
        }
      }

      toast.success('Conta criada com sucesso! 🎉');
      
      // Redirecionar para login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Conta criada! Faça login para continuar.',
            email: profileData.email 
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setSubmitting(false);
    }
  };

  // Renderização
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const goalOptions = [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar condicionamento',
    'Aumentar força',
    'Melhorar flexibilidade',
    'Preparação desportiva',
    'Saúde geral'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Configurar Conta</h1>
          <p className="text-gray-600 mt-2">Complete o seu perfil para começar</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex items-center ${
                  step < 4 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Conta */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Dados de Acesso</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Dados Pessoais */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="912345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Dados Físicos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Dados Físicos</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="170"
                />
                {errors.height && (
                  <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="70"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Atividade
                </label>
                <select
                  name="activityLevel"
                  value={profileData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="sedentary">Sedentário</option>
                  <option value="light">Pouco ativo</option>
                  <option value="moderate">Moderadamente ativo</option>
                  <option value="active">Ativo</option>
                  <option value="very_active">Muito ativo</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Objetivos */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Objetivos e Saúde</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos (selecione todos que se aplicam)
                </label>
                <div className="space-y-2">
                  {goalOptions.map(goal => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.goals.includes(goal)}
                        onChange={() => handleArrayToggle('goals', goal)}
                        className="mr-2"
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </div>
                {errors.goals && (
                  <p className="text-red-500 text-sm mt-1">{errors.goals}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condições Médicas (opcional)
                </label>
                <textarea
                  name="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Lesões, alergias, medicação..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto de Emergência
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={profileData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nome do contacto"
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone de Emergência
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={profileData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="912345678"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="inline h-5 w-5 mr-1" />
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Próximo
                <ChevronRight className="inline h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="inline h-5 w-5 mr-2 animate-spin" />
                    A criar conta...
                  </>
                ) : (
                  <>
                    Criar Conta
                    <CheckCircle className="inline h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mensagem do Trainer */}
        {inviteData?.invite_message && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
            <div className="flex items-start">
              <Heart className="h-5 w-5 text-green-600 mt-1 mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Mensagem do seu trainer:
                </h4>
                <p className="text-gray-600 italic">
                  "{inviteData.invite_message}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AthleteSetup;