// src/modules/shared/pages/AthleteSetup.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Heart,
  Target,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import InviteService from '../../../services/supabase/invite.service';
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
  
  // Estado do formulário
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    avatar: null,
    
    // Physical Info
    height: '',
    weight: '',
    activityLevel: '',
    
    // Goals & Preferences
    goals: [],
    preferredTrainingDays: [],
    preferredTrainingTime: '',
    
    // Medical Info
    medicalConditions: '',
    injuries: '',
    medications: '',
    allergies: '',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Account
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
      return;
    }
    
    try {
      // Validar o token usando o serviço
      const validation = await InviteService.validateInviteToken(token);
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
      } else {
        setTokenValid(false);
        console.error('❌ Token inválido:', validation.error);
      }
    } catch (error) {
      console.error('❌ Erro ao validar token:', error);
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Physical Details', icon: Heart },
    { number: 3, title: 'Goals & Preferences', icon: Target },
    { number: 4, title: 'Medical Information', icon: AlertCircle },
    { number: 5, title: 'Create Account', icon: Check }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!profileData.name) newErrors.name = 'Name is required';
        if (!profileData.phone) newErrors.phone = 'Phone is required';
        if (!profileData.birthDate) newErrors.birthDate = 'Birth date is required';
        if (!profileData.gender) newErrors.gender = 'Gender is required';
        break;
      
      case 2:
        if (!profileData.height) newErrors.height = 'Height is required';
        if (!profileData.weight) newErrors.weight = 'Weight is required';
        if (!profileData.activityLevel) newErrors.activityLevel = 'Activity level is required';
        break;
      
      case 3:
        if (profileData.goals.length === 0) newErrors.goals = 'Please select at least one goal';
        if (profileData.preferredTrainingDays.length === 0) newErrors.preferredTrainingDays = 'Please select at least one training day';
        break;
      
      case 5:
        if (!profileData.password) newErrors.password = 'Password is required';
        if (profileData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (profileData.password !== profileData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!profileData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // FUNÇÃO PRINCIPAL CORRIGIDA - CRIAÇÃO DE PERFIL
  const handleSubmit = async () => {
    console.log('🚀 Iniciando criação de perfil...');
    
    if (!validateStep(currentStep)) {
      console.log('❌ Validação falhou');
      return;
    }
    
    setLoading(true);
    
    try {
      // PASSO 1: Criar conta no Supabase Auth
      console.log('1️⃣ Criando conta de autenticação...');
      
      let userId;
      let isNewUser = true;
      
      // Tentar criar nova conta
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: profileData.email,
        password: profileData.password,
        options: {
          data: {
            name: profileData.name,
            role: 'athlete'
          }
        }
      });
      
      if (signUpError) {
        // Se o usuário já existe, tentar fazer login
        if (signUpError.message.includes('already registered')) {
          console.log('ℹ️ Usuário já existe, tentando login...');
          isNewUser = false;
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: profileData.email,
            password: profileData.password
          });
          
          if (signInError) {
            throw new Error('Este email já está registado. Por favor, use a password correta ou contacte o suporte.');
          }
          
          userId = signInData.user.id;
        } else {
          throw signUpError;
        }
      } else {
        userId = signUpData.user.id;
        console.log('✅ Nova conta criada:', userId);
      }
      
      // PASSO 2: Aguardar o trigger criar o perfil básico (apenas para novos usuários)
      if (isNewUser) {
        console.log('2️⃣ Aguardando criação automática do perfil...');
        
        // Dar tempo para o trigger do Supabase criar o perfil
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se o perfil foi criado
        let profileExists = false;
        for (let i = 0; i < 3; i++) {
          const { data: checkProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();
          
          if (checkProfile) {
            profileExists = true;
            console.log('✅ Perfil encontrado');
            break;
          }
          
          console.log(`⏳ Aguardando perfil... tentativa ${i + 1}/3`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Se o perfil não foi criado automaticamente, criar manualmente
        if (!profileExists) {
          console.log('ℹ️ Criando perfil manualmente...');
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: profileData.email,
              name: profileData.name,
              role: 'athlete'
            });
          
          if (createProfileError && createProfileError.code !== '23505') {
            console.error('Erro ao criar perfil:', createProfileError);
          }
        }
      }
      
      // PASSO 3: Atualizar o perfil com todos os dados
      console.log('3️⃣ Atualizando perfil com dados completos...');
      
      const profileUpdateData = {
        name: profileData.name,
        phone: profileData.phone,
        role: 'athlete',
        setup_complete: true,
        profile_complete: true,
        updated_at: new Date().toISOString()
      };
      
      // Adicionar campos opcionais apenas se existirem
      if (profileData.birthDate) profileUpdateData.birth_date = profileData.birthDate;
      if (profileData.gender) profileUpdateData.gender = profileData.gender;
      
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', userId);
      
      if (updateProfileError) {
        console.error('⚠️ Erro ao atualizar perfil:', updateProfileError);
        // Não vamos parar o processo por causa disto
      } else {
        console.log('✅ Perfil atualizado com sucesso');
      }
      
      // PASSO 4: Criar registo na tabela athletes (se existir)
      console.log('4️⃣ Criando registo de atleta...');
      
      try {
        // Verificar se a tabela athletes existe e se já tem um registo
        const { data: existingAthlete, error: checkError } = await supabase
          .from('athletes')
          .select('id')
          .eq('email', profileData.email)
          .maybeSingle();
        
        if (!checkError && !existingAthlete) {
          // Preparar dados para a tabela athletes
          const athleteData = {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            setupCompleted: true,
            status: 'active'
          };
          
          // Adicionar campos opcionais
          if (profileData.birthDate) athleteData.birthDate = profileData.birthDate;
          if (profileData.gender) athleteData.gender = profileData.gender;
          if (profileData.height) athleteData.height = parseInt(profileData.height);
          if (profileData.weight) athleteData.weight = parseFloat(profileData.weight);
          if (profileData.goals.length > 0) athleteData.goals = profileData.goals.join(', ');
          if (profileData.medicalConditions) athleteData.medicalConditions = profileData.medicalConditions;
          if (profileData.emergencyContact) athleteData.emergencyContact = profileData.emergencyContact;
          if (profileData.emergencyPhone) athleteData.emergencyPhone = profileData.emergencyPhone;
          
          // Se veio de um convite, adicionar o trainer_id
          if (inviteData?.trainer_id) {
            athleteData.trainer_id = inviteData.trainer_id;
          }
          
          const { data: newAthlete, error: createAthleteError } = await supabase
            .from('athletes')
            .insert(athleteData)
            .select()
            .single();
          
          if (createAthleteError) {
            console.error('⚠️ Erro ao criar atleta:', createAthleteError);
            // Continuar mesmo com erro
          } else {
            console.log('✅ Atleta criado:', newAthlete);
          }
        }
      } catch (error) {
        console.log('ℹ️ Tabela athletes pode não existir ou erro ao verificar:', error);
        // Continuar sem problemas
      }
      
      // PASSO 5: Aceitar o convite (se aplicável)
      if (token && inviteData) {
        console.log('5️⃣ Aceitando convite...');
        
        try {
          const acceptResult = await InviteService.acceptInvite(token, userId);
          
          if (acceptResult.success) {
            console.log('✅ Convite aceite com sucesso');
          } else {
            console.error('⚠️ Erro ao aceitar convite:', acceptResult.error);
          }
          
          // Criar relação trainer-atleta se necessário
          if (inviteData.trainer_id) {
            try {
              await supabase
                .from('trainer_athlete_relationships')
                .insert({
                  trainer_id: inviteData.trainer_id,
                  athlete_id: userId,
                  status: 'active'
                });
              console.log('✅ Relação trainer-atleta criada');
            } catch (error) {
              console.log('ℹ️ Erro ao criar relação (pode já existir):', error);
            }
          }
        } catch (error) {
          console.error('⚠️ Erro no processo de aceitar convite:', error);
          // Continuar mesmo com erro
        }
      }
      
      // PASSO 6: Fazer login automático
      console.log('6️⃣ Fazendo login automático...');
      
      if (isNewUser) {
        // Para novos usuários, já devem estar logados após o signUp
        console.log('✅ Novo usuário já está logado');
      } else {
        // Para usuários existentes, garantir que estão logados
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password: profileData.password
        });
        
        if (signInError) {
          console.error('⚠️ Erro ao fazer login:', signInError);
          toast.warning('Perfil atualizado! Por favor, faça login manualmente.');
          navigate('/login');
          return;
        }
      }
      
      // SUCESSO!
      console.log('🎉 Processo completo com sucesso!');
      toast.success('Bem-vindo ao SIGA180! 🎉');
      
      // Aguardar um momento para garantir que tudo está sincronizado
      setTimeout(() => {
        navigate('/athlete/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erro no processo:', error);
      
      let errorMessage = 'Erro ao criar perfil. ';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está registado. Use outro email ou faça login.';
      } else if (error.message?.includes('password')) {
        errorMessage = 'Password deve ter pelo menos 6 caracteres.';
      } else if (error.message?.includes('email')) {
        errorMessage = 'Email inválido. Verifique o formato.';
      } else {
        errorMessage += error.message || 'Por favor, tente novamente.';
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

  // Se ainda está a validar o token, mostrar loading
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validando convite...</p>
        </div>
      </div>
    );
  }

  // Se o token não é válido, mostrar erro
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Inválido ou Expirado</h2>
          <p className="text-gray-600 mb-6">
            Este link de configuração é inválido ou já expirou. Por favor, contacte o seu trainer para um novo convite.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  // Renderizar o formulário principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-1">Welcome! Let's set up your fitness profile.</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              {/* Name - Pre-filled from invite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } ${inviteData ? 'bg-gray-50' : ''}`}
                  readOnly={!!inviteData?.athlete_name}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email - Pre-filled from invite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="+351 912 345 678"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.birthDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.gender ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Physical Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Details</h2>
              
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.height ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="170"
                  min="100"
                  max="250"
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.weight ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="70"
                  min="30"
                  max="300"
                  step="0.1"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level *
                </label>
                <select
                  name="activityLevel"
                  value={profileData.activityLevel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.activityLevel ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="lightly-active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately-active">Moderately Active (3-5 days/week)</option>
                  <option value="very-active">Very Active (6-7 days/week)</option>
                  <option value="extremely-active">Extremely Active (twice per day)</option>
                </select>
                {errors.activityLevel && <p className="mt-1 text-sm text-red-600">{errors.activityLevel}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Goals & Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals & Preferences</h2>
              
              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What are your fitness goals? *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'weight-loss', label: 'Lose Weight' },
                    { value: 'muscle-gain', label: 'Build Muscle' },
                    { value: 'endurance', label: 'Improve Endurance' },
                    { value: 'strength', label: 'Increase Strength' },
                    { value: 'flexibility', label: 'Improve Flexibility' },
                    { value: 'general-fitness', label: 'General Fitness' },
                    { value: 'athletic-performance', label: 'Athletic Performance' }
                  ].map(goal => (
                    <label key={goal.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.goals.includes(goal.value)}
                        onChange={() => handleArrayToggle('goals', goal.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{goal.label}</span>
                    </label>
                  ))}
                </div>
                {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
              </div>

              {/* Preferred Training Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Training Days *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'monday', label: 'Monday' },
                    { value: 'tuesday', label: 'Tuesday' },
                    { value: 'wednesday', label: 'Wednesday' },
                    { value: 'thursday', label: 'Thursday' },
                    { value: 'friday', label: 'Friday' },
                    { value: 'saturday', label: 'Saturday' },
                    { value: 'sunday', label: 'Sunday' }
                  ].map(day => (
                    <label key={day.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.preferredTrainingDays.includes(day.value)}
                        onChange={() => handleArrayToggle('preferredTrainingDays', day.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredTrainingDays && <p className="mt-1 text-sm text-red-600">{errors.preferredTrainingDays}</p>}
              </div>

              {/* Preferred Training Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Training Time
                </label>
                <select
                  name="preferredTrainingTime"
                  value={profileData.preferredTrainingTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select preferred time</option>
                  <option value="early-morning">Early Morning (5:00 - 8:00)</option>
                  <option value="morning">Morning (8:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                  <option value="evening">Evening (17:00 - 21:00)</option>
                  <option value="night">Night (21:00 - 23:00)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Medical Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h2>
              <p className="text-sm text-gray-600 mb-6">
                This information helps your trainer create safe and effective workouts for you.
              </p>

              {/* Medical Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  name="medicalConditions"
                  value={profileData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any medical conditions (e.g., diabetes, hypertension, asthma)"
                />
              </div>

              {/* Injuries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Past or Current Injuries
                </label>
                <textarea
                  name="injuries"
                  value={profileData.injuries}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any injuries that may affect your training"
                />
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  name="medications"
                  value={profileData.medications}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any medications you're currently taking"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any allergies (food, environmental, etc.)"
                />
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+351 912 345 678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergencyRelation"
                      value={profileData.emergencyRelation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Spouse, Parent, Friend, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Create Account */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your Account</h2>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Minimum 6 characters"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="border-t pt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={profileData.termsAccepted}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the Terms of Service and Privacy Policy. I understand that my trainer will have access to my profile information and progress data.
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-sm text-red-600 ml-6">{errors.terms}</p>}
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Name:</dt>
                    <dd className="font-medium">{profileData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Email:</dt>
                    <dd className="font-medium">{profileData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Goals:</dt>
                    <dd className="font-medium">{profileData.goals.length} selected</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Training Days:</dt>
                    <dd className="font-medium">{profileData.preferredTrainingDays.length} days/week</dd>
                  </div>
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
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Complete Setup
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