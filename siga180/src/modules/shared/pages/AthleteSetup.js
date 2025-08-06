// siga180/src/modules/shared/pages/AthleteSetup.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Heart,
  Target,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import inviteService from '../../../services/supabase/inviteService.js';
import toast from 'react-hot-toast';

const AthleteSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  
  // Estado do formulário simplificado
  const [profileData, setProfileData] = useState({
    // Step 1 - Basic Info
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    
    // Step 2 - Physical Details
    height: '',
    weight: '',
    activityLevel: '',
    
    // Step 3 - Goals
    goals: [],
    preferredTrainingDays: [],
    preferredTrainingTime: '',
    
    // Step 4 - Medical (opcional)
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Step 5 - Account
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});

  // Validar o token quando o componente carrega
  useEffect(() => {
    validateInviteToken();
  }, [token]);

  const validateInviteToken = async () => {
    console.log('🔍 Validando token:', token);
    
    if (!token) {
      console.log('❌ Nenhum token fornecido');
      setTokenValid(false);
      setValidatingToken(false);
      toast.error('Link inválido - token não encontrado');
      return;
    }
    
    try {
      // Validar o token usando o serviço
      const validation = await inviteService.validateInviteToken(token);
      console.log('📋 Resultado da validação:', validation);
      
      if (validation.valid && validation.invite) {
        // Token válido - preencher os dados do convite
        setProfileData(prev => ({
          ...prev,
          name: validation.invite.athlete_name || '',
          email: validation.invite.athlete_email || ''
        }));
        
        setInviteData(validation.invite);
        setTokenValid(true);
        console.log('✅ Token válido! Dados do convite:', validation.invite);
        toast.success('Convite válido! Vamos configurar seu perfil.');
      } else {
        setTokenValid(false);
        console.error('❌ Token inválido:', validation.error);
        toast.error(validation.error || 'Convite inválido');
      }
    } catch (error) {
      console.error('❌ Erro ao validar token:', error);
      setTokenValid(false);
      toast.error('Erro ao validar convite');
    } finally {
      setValidatingToken(false);
    }
  };

  const steps = [
    { number: 1, title: 'Informações Básicas', icon: User },
    { number: 2, title: 'Detalhes Físicos', icon: Heart },
    { number: 3, title: 'Objetivos', icon: Target },
    { number: 4, title: 'Informações Médicas', icon: AlertCircle },
    { number: 5, title: 'Criar Conta', icon: Lock }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!profileData.name) newErrors.name = 'Nome é obrigatório';
        if (!profileData.phone) newErrors.phone = 'Telefone é obrigatório';
        if (!profileData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
        if (!profileData.gender) newErrors.gender = 'Género é obrigatório';
        break;
      
      case 2:
        if (!profileData.height) newErrors.height = 'Altura é obrigatória';
        if (!profileData.weight) newErrors.weight = 'Peso é obrigatório';
        if (!profileData.activityLevel) newErrors.activityLevel = 'Nível de atividade é obrigatório';
        break;
      
      case 3:
        if (profileData.goals.length === 0) newErrors.goals = 'Selecione pelo menos um objetivo';
        if (profileData.preferredTrainingDays.length === 0) newErrors.preferredTrainingDays = 'Selecione pelo menos um dia';
        break;
      
      case 5:
        if (!profileData.password) newErrors.password = 'Password é obrigatória';
        if (profileData.password.length < 6) newErrors.password = 'Password deve ter pelo menos 6 caracteres';
        if (profileData.password !== profileData.confirmPassword) newErrors.confirmPassword = 'Passwords não coincidem';
        if (!profileData.termsAccepted) newErrors.terms = 'Deve aceitar os termos';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // FUNÇÃO PRINCIPAL - CRIAR PERFIL
  const handleSubmit = async () => {
    console.log('🚀 Iniciando criação de perfil...');
    
    if (!validateStep(currentStep)) {
      console.log('❌ Validação falhou');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Criar conta no Supabase Auth
      console.log('1️⃣ Criando conta...');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: profileData.email,
        password: profileData.password,
        options: {
          data: {
            name: profileData.name,
            phone: profileData.phone,
            birth_date: profileData.birthDate,
            gender: profileData.gender
          }
        }
      });
      
      if (signUpError) {
        // Se o email já existe
        if (signUpError.message.includes('already registered')) {
          throw new Error('Este email já está registado. Use outro email ou faça login.');
        }
        throw signUpError;
      }
      
      const userId = signUpData.user.id;
      console.log('✅ Conta criada:', userId);
      
      // 2. Aguardar um momento para o trigger criar o perfil
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 3. Atualizar o perfil com dados completos
      console.log('2️⃣ Atualizando perfil...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          birth_date: profileData.birthDate,
          gender: profileData.gender,
          role: 'athlete',
          setup_complete: true,
          // Adicionar campos extras se existirem
          height: profileData.height ? parseInt(profileData.height) : null,
          weight: profileData.weight ? parseFloat(profileData.weight) : null,
          activity_level: profileData.activityLevel || null,
          goals: profileData.goals.length > 0 ? profileData.goals : null,
          training_days: profileData.preferredTrainingDays.length > 0 ? profileData.preferredTrainingDays : null,
          training_time: profileData.preferredTrainingTime || null,
          medical_conditions: profileData.medicalConditions || null,
          emergency_contact: profileData.emergencyContact || null,
          emergency_phone: profileData.emergencyPhone || null
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('⚠️ Erro ao atualizar perfil:', updateError);
        // Não é crítico, continuar
      } else {
        console.log('✅ Perfil atualizado');
      }
      
      // 4. Aceitar o convite
      if (token && inviteData) {
        console.log('3️⃣ Aceitando convite...');
        
        const acceptResult = await inviteService.acceptInvite(token, userId);
        
        if (acceptResult.success) {
          console.log('✅ Convite aceite');
          
          // Criar relação trainer-atleta
          if (inviteData.trainer_id) {
            try {
              const { error: relationError } = await supabase
                .from('trainer_athlete_relations')
                .insert({
                  trainer_id: inviteData.trainer_id,
                  athlete_id: userId,
                  status: 'active',
                  created_at: new Date().toISOString()
                });
              
              if (!relationError) {
                console.log('✅ Relação trainer-atleta criada');
              }
            } catch (error) {
              console.log('ℹ️ Tabela de relações pode não existir');
            }
          }
        }
      }
      
      // SUCESSO!
      console.log('🎉 Processo completo!');
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
      console.error('❌ Erro:', error);
      
      let errorMessage = 'Erro ao criar conta. ';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está registado.';
      } else if (error.message?.includes('password')) {
        errorMessage = 'Password deve ter pelo menos 6 caracteres.';
      } else {
        errorMessage += error.message || 'Tente novamente.';
      }
      
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Loading state
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">A validar convite...</p>
        </div>
      </div>
    );
  }

  // Token inválido
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido</h2>
          <p className="text-gray-600 mb-6">
            Este link é inválido ou expirou. Contacte o seu trainer para um novo convite.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  // Formulário principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurar Perfil</h1>
          <p className="text-gray-600 mt-1">Bem-vindo! Vamos configurar o seu perfil de atleta.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep > step.number 
                  ? 'bg-green-600 text-white' 
                  : currentStep === step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } ${inviteData ? 'bg-gray-50' : ''}`}
                  readOnly={!!inviteData?.athlete_name}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Email não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+351 912 345 678"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.birthDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género *
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecionar</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Physical Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes Físicos</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.height ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="170"
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.weight ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="70"
                  step="0.1"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Atividade *
                </label>
                <select
                  name="activityLevel"
                  value={profileData.activityLevel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.activityLevel ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecionar</option>
                  <option value="sedentary">Sedentário</option>
                  <option value="lightly-active">Pouco Ativo (1-3 dias/semana)</option>
                  <option value="moderately-active">Moderadamente Ativo (3-5 dias/semana)</option>
                  <option value="very-active">Muito Ativo (6-7 dias/semana)</option>
                </select>
                {errors.activityLevel && <p className="mt-1 text-sm text-red-600">{errors.activityLevel}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivos e Preferências</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Objetivos *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'weight-loss', label: 'Perder Peso' },
                    { value: 'muscle-gain', label: 'Ganhar Massa Muscular' },
                    { value: 'endurance', label: 'Melhorar Resistência' },
                    { value: 'strength', label: 'Aumentar Força' },
                    { value: 'general-fitness', label: 'Condição Física Geral' }
                  ].map(goal => (
                    <label key={goal.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.goals.includes(goal.value)}
                        onChange={() => handleArrayToggle('goals', goal.value)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2">{goal.label}</span>
                    </label>
                  ))}
                </div>
                {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dias de Treino Preferidos *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'monday', label: 'Segunda' },
                    { value: 'tuesday', label: 'Terça' },
                    { value: 'wednesday', label: 'Quarta' },
                    { value: 'thursday', label: 'Quinta' },
                    { value: 'friday', label: 'Sexta' },
                    { value: 'saturday', label: 'Sábado' },
                    { value: 'sunday', label: 'Domingo' }
                  ].map(day => (
                    <label key={day.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferredTrainingDays.includes(day.value)}
                        onChange={() => handleArrayToggle('preferredTrainingDays', day.value)}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2">{day.label}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredTrainingDays && <p className="mt-1 text-sm text-red-600">{errors.preferredTrainingDays}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário Preferido
                </label>
                <select
                  name="preferredTrainingTime"
                  value={profileData.preferredTrainingTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecionar</option>
                  <option value="morning">Manhã (6:00 - 12:00)</option>
                  <option value="afternoon">Tarde (12:00 - 18:00)</option>
                  <option value="evening">Noite (18:00 - 22:00)</option>
                  <option value="flexible">Flexível</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Medical Information (Opcional) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Médicas</h2>
              <p className="text-sm text-gray-600 mb-6">
                Opcional - Ajuda o trainer a criar treinos seguros para si.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condições Médicas
                </label>
                <textarea
                  name="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Diabetes, hipertensão, etc. (opcional)"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de Emergência</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Nome do contacto (opcional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="+351 912 345 678 (opcional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Create Account */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Conta</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Repetir password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <div className="border-t pt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={profileData.termsAccepted}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aceito os Termos de Serviço e Política de Privacidade.
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-sm text-red-600 ml-6">{errors.terms}</p>}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Nome:</dt>
                    <dd className="font-medium">{profileData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Email:</dt>
                    <dd className="font-medium">{profileData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Objetivos:</dt>
                    <dd className="font-medium">{profileData.goals.length} selecionados</dd>
                  </div>
                  {inviteData && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Trainer:</dt>
                      <dd className="font-medium text-green-600">Será associado automaticamente</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Anterior
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Próximo
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    A criar conta...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Criar Conta
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteSetup;