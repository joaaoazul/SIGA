// src/modules/trainer/pages/EditAthlete.js
// Componente de Anamnese Completa do Atleta

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, User, Mail, Phone, Calendar, Activity, Target, Heart, 
  Ruler, Weight, AlertCircle, Loader2, X, Plus, CheckCircle, Brain,
  Coffee, Moon, Droplets, Utensils, Trophy, Music, Users, MessageSquare,
  FileText, Clock, Dumbbell, MapPin, Stethoscope, Apple, Cigarette, Wine
} from 'lucide-react';
import { supabase } from '../../../services/supabase/supabaseClient';
import { useAuth } from '../../shared/hooks/useAuth';
import toast from 'react-hot-toast';

const EditAthlete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  
  // Estado do formulário - Anamnese Completa
  const [formData, setFormData] = useState({
    // Informações Básicas
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    occupation: '',
    
    // Informações Físicas
    height: '',
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    
    // Objetivos
    goals: [],
    why_training: '',
    expectations: '',
    motivation_level: '',
    biggest_challenges: [],
    
    // Histórico de Saúde
    medical_conditions: [],
    medications: '',
    allergies: '',
    injuries_history: '',
    surgeries_history: '',
    chronic_conditions: [],
    
    // Contacto de Emergência
    emergency_contact: '',
    emergency_phone: '',
    emergency_relationship: '',
    
    // Experiência e Nível
    activity_level: '',
    training_experience: '',
    previous_training_experience: '',
    training_frequency: '',
    
    // Preferências de Treino
    preferred_training_time: '',
    training_location: '',
    equipment_available: [],
    availability: [],
    music_preference: true,
    group_training_preference: '',
    trainer_gender_preference: '',
    communication_preference: [],
    
    // Estilo de Vida
    lifestyle: '',
    sleep_hours: '',
    sleep_quality: '',
    stress_level: '',
    hydration: '',
    alcohol_consumption: '',
    smoking_status: '',
    
    // Nutrição
    dietary_restrictions: [],
    meal_frequency: '',
    supplements: [],
    eating_habits: '',
    food_preferences: [],
    food_aversions: [],
    
    // Notas
    trainer_notes: '',
    internal_notes: '',
    
    // Campos personalizados temporários
    customGoal: '',
    customChallenge: '',
    customCondition: '',
    customChronic: '',
    customEquipment: '',
    customRestriction: '',
    customSupplement: '',
    customPreference: '',
    customAversion: ''
  });

  // Opções para os campos
  const options = {
    goals: [
      'Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento',
      'Aumentar força', 'Melhorar flexibilidade', 'Preparação para competição',
      'Reabilitação', 'Bem-estar geral', 'Melhorar postura', 'Reduzir stress',
      'Melhorar performance desportiva', 'Tonificar', 'Aumentar resistência'
    ],
    
    challenges: [
      'Falta de tempo', 'Falta de motivação', 'Lesões recorrentes',
      'Alimentação descontrolada', 'Stress', 'Falta de consistência',
      'Dificuldade em recuperar', 'Horários irregulares', 'Vida social',
      'Trabalho sedentário', 'Ansiedade', 'Falta de conhecimento'
    ],
    
    medicalConditions: [
      'Hipertensão', 'Diabetes', 'Asma', 'Problemas cardíacos',
      'Lesão no joelho', 'Lesão no ombro', 'Lesão nas costas',
      'Artrite', 'Osteoporose', 'Ansiedade', 'Depressão',
      'Problemas de coluna', 'Tendinite', 'Bursite'
    ],
    
    chronicConditions: [
      'Diabetes tipo 1', 'Diabetes tipo 2', 'Hipertensão arterial',
      'Doença cardíaca', 'Artrite reumatoide', 'Fibromialgia',
      'Síndrome do intestino irritável', 'Enxaqueca crônica',
      'Doença de Crohn', 'Hipotiroidismo', 'Hipertiroidismo'
    ],
    
    activityLevel: [
      { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
      { value: 'lightly_active', label: 'Levemente ativo (1-3 dias/semana)' },
      { value: 'moderately_active', label: 'Moderadamente ativo (3-5 dias/semana)' },
      { value: 'very_active', label: 'Muito ativo (6-7 dias/semana)' },
      { value: 'extra_active', label: 'Extra ativo (atleta/trabalho físico)' }
    ],
    
    experience: [
      { value: 'none', label: 'Sem experiência' },
      { value: 'beginner', label: 'Iniciante (< 6 meses)' },
      { value: 'intermediate', label: 'Intermediário (6 meses - 2 anos)' },
      { value: 'advanced', label: 'Avançado (2-5 anos)' },
      { value: 'expert', label: 'Expert (> 5 anos)' }
    ],
    
    trainingTime: [
      { value: 'early_morning', label: 'Madrugada (5h-7h)' },
      { value: 'morning', label: 'Manhã (7h-12h)' },
      { value: 'lunch', label: 'Hora de almoço (12h-14h)' },
      { value: 'afternoon', label: 'Tarde (14h-18h)' },
      { value: 'evening', label: 'Noite (18h-21h)' },
      { value: 'late_evening', label: 'Noite tardia (21h-23h)' },
      { value: 'flexible', label: 'Horário flexível' }
    ],
    
    equipment: [
      'Halteres', 'Barra e anilhas', 'Kettlebells', 'Bandas elásticas',
      'TRX', 'Bola suíça', 'Tapete', 'Pull-up bar', 'Máquinas de ginásio',
      'Bicicleta/Elíptica', 'Passadeira', 'Remo', 'Box jump', 'Medicine ball',
      'Foam roller', 'Mini bands'
    ],
    
    weekDays: [
      'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
    ],
    
    dietaryRestrictions: [
      'Vegetariano', 'Vegan', 'Sem glúten', 'Sem lactose',
      'Sem açúcar', 'Low carb', 'Keto', 'Paleo', 'Kosher',
      'Halal', 'Alergia a frutos secos', 'Alergia a marisco'
    ],
    
    supplements: [
      'Proteína whey', 'Creatina', 'BCAA', 'Multivitamínico',
      'Ômega 3', 'Vitamina D', 'Magnésio', 'Pré-treino',
      'Glutamina', 'Colagénio', 'Vitamina C', 'Zinco',
      'Probióticos', 'Cafeína'
    ],
    
    communicationPrefs: [
      'WhatsApp', 'Email', 'SMS', 'Chamada telefónica',
      'App da plataforma', 'Presencial'
    ]
  };

  // Seções do formulário
  const sections = [
    { id: 'basic', label: 'Dados Pessoais', icon: User },
    { id: 'physical', label: 'Avaliação Física', icon: Ruler },
    { id: 'goals', label: 'Objetivos', icon: Target },
    { id: 'health', label: 'Histórico de Saúde', icon: Stethoscope },
    { id: 'lifestyle', label: 'Estilo de Vida', icon: Coffee },
    { id: 'nutrition', label: 'Nutrição', icon: Apple },
    { id: 'training', label: 'Experiência', icon: Dumbbell },
    { id: 'preferences', label: 'Preferências', icon: Heart },
    { id: 'notes', label: 'Observações', icon: FileText }
  ];

  useEffect(() => {
    if (id && user?.id) {
      fetchAthleteData();
    }
  }, [id, user]);

  const fetchAthleteData = async () => {
    try {
      setLoading(true);

      // Verificar permissão através do convite
      const { data: invite } = await supabase
        .from('invites')
        .select('*')
        .eq('trainer_id', user.id)
        .or(`accepted_by.eq.${id},id.eq.${id}`)
        .eq('status', 'accepted')
        .single();

      if (!invite) {
        toast.error('Sem permissão para editar este atleta');
        navigate('/athletes');
        return;
      }

      // Buscar perfil do atleta
      const athleteId = invite.accepted_by || id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athleteId)
        .single();

      if (profile) {
        // Preencher formulário com dados existentes
        setFormData({
          ...formData,
          // Básicos
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          birth_date: profile.birth_date || '',
          gender: profile.gender || '',
          occupation: profile.occupation || '',
          
          // Físicos
          height: profile.height || '',
          weight: profile.weight || '',
          body_fat_percentage: profile.body_fat_percentage || '',
          muscle_mass: profile.muscle_mass || '',
          
          // Objetivos
          goals: profile.goals || [],
          why_training: profile.why_training || '',
          expectations: profile.expectations || '',
          motivation_level: profile.motivation_level || '',
          biggest_challenges: profile.biggest_challenges || [],
          
          // Saúde
          medical_conditions: profile.medical_conditions || [],
          medications: profile.medications || '',
          allergies: profile.allergies || '',
          injuries_history: profile.injuries_history || '',
          surgeries_history: profile.surgeries_history || '',
          chronic_conditions: profile.chronic_conditions || [],
          emergency_contact: profile.emergency_contact || '',
          emergency_phone: profile.emergency_phone || '',
          emergency_relationship: profile.emergency_relationship || '',
          
          // Treino
          activity_level: profile.activity_level || '',
          training_experience: profile.training_experience || '',
          previous_training_experience: profile.previous_training_experience || '',
          training_frequency: profile.training_frequency || '',
          preferred_training_time: profile.preferred_training_time || '',
          training_location: profile.training_location || '',
          equipment_available: profile.equipment_available || [],
          availability: profile.availability || [],
          
          // Preferências
          music_preference: profile.music_preference !== false,
          group_training_preference: profile.group_training_preference || '',
          trainer_gender_preference: profile.trainer_gender_preference || '',
          communication_preference: profile.communication_preference || [],
          
          // Estilo de vida
          lifestyle: profile.lifestyle || '',
          sleep_hours: profile.sleep_hours || '',
          sleep_quality: profile.sleep_quality || '',
          stress_level: profile.stress_level || '',
          hydration: profile.hydration || '',
          alcohol_consumption: profile.alcohol_consumption || '',
          smoking_status: profile.smoking_status || '',
          
          // Nutrição
          dietary_restrictions: profile.dietary_restrictions || [],
          meal_frequency: profile.meal_frequency || '',
          supplements: profile.supplements || [],
          eating_habits: profile.eating_habits || '',
          food_preferences: profile.food_preferences || [],
          food_aversions: profile.food_aversions || [],
          
          // Notas
          trainer_notes: profile.trainer_notes || '',
          internal_notes: profile.internal_notes || ''
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (Array.isArray(formData[name])) {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addToArray = (field, value, customField) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value],
        [customField]: ''
      }));
    }
  };

  const removeFromArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const h = formData.height / 100;
      return (formData.weight / (h * h)).toFixed(1);
    }
    return null;
  };

  const checkAnamnesesComplete = () => {
    const required = [
      'name', 'birth_date', 'height', 'weight',
      'activity_level', 'training_experience',
      'emergency_contact', 'emergency_phone'
    ];
    
    return required.every(field => formData[field]) && 
           formData.goals.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const updateData = {
        ...formData,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        profile_complete: checkAnamnesesComplete(),
        anamnese_completed_at: checkAnamnesesComplete() ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      // Remover campos temporários
      delete updateData.customGoal;
      delete updateData.customChallenge;
      delete updateData.customCondition;
      delete updateData.customChronic;
      delete updateData.customEquipment;
      delete updateData.customRestriction;
      delete updateData.customSupplement;
      delete updateData.customPreference;
      delete updateData.customAversion;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Anamnese atualizada com sucesso!');
      navigate(`/athletes/${id}`);

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar anamnese');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const age = calculateAge(formData.birth_date);
  const bmi = calculateBMI();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/athletes/${id}`)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anamnese do Atleta</h1>
              <p className="text-gray-600 mt-1">Avaliação completa e detalhada</p>
            </div>
          </div>
          
          {checkAnamnesesComplete() ? (
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Anamnese Completa</span>
            </div>
          ) : (
            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Anamnese Incompleta</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-2 mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section: Dados Pessoais */}
        {activeSection === 'basic' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {age && <p className="text-xs text-gray-500 mt-1">Idade: {age} anos</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissão
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contacto de Emergência */}
            <h3 className="text-md font-semibold text-gray-900 mt-6 mb-3">Contacto de Emergência</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relação
                </label>
                <input
                  type="text"
                  name="emergency_relationship"
                  value={formData.emergency_relationship}
                  onChange={handleChange}
                  placeholder="Ex: Cônjuge, Pai/Mãe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section: Avaliação Física */}
        {activeSection === 'physical' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliação Física</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IMC
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                  {bmi || '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  % Gordura Corporal
                </label>
                <input
                  type="number"
                  name="body_fat_percentage"
                  value={formData.body_fat_percentage}
                  onChange={handleChange}
                  min="3"
                  max="60"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Massa Muscular (kg)
                </label>
                <input
                  type="number"
                  name="muscle_mass"
                  value={formData.muscle_mass}
                  onChange={handleChange}
                  min="10"
                  max="150"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section: Objetivos */}
        {activeSection === 'goals' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Objetivos e Motivação</h2>
            
            {/* Objetivos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos *
              </label>
              {formData.goals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.goals.map((goal, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeFromArray('goals', goal)}
                        className="ml-2 hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {options.goals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => addToArray('goals', goal, 'customGoal')}
                    disabled={formData.goals.includes(goal)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      formData.goals.includes(goal)
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 hover:bg-purple-50 text-gray-700'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                  placeholder="Adicionar objetivo personalizado..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.customGoal.trim()) {
                      addToArray('goals', formData.customGoal.trim(), 'customGoal');
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Motivação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Por que decidiu treinar?
                </label>
                <textarea
                  name="why_training"
                  value={formData.why_training}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expectativas
                </label>
                <textarea
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Motivação
              </label>
              <select
                name="motivation_level"
                value={formData.motivation_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                <option value="very_low">Muito baixo</option>
                <option value="low">Baixo</option>
                <option value="moderate">Moderado</option>
                <option value="high">Alto</option>
                <option value="very_high">Muito alto</option>
              </select>
            </div>

            {/* Desafios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maiores Desafios
              </label>
              {formData.biggest_challenges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.biggest_challenges.map((challenge, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {challenge}
                      <button
                        type="button"
                        onClick={() => removeFromArray('biggest_challenges', challenge)}
                        className="ml-2 hover:text-orange-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {options.challenges.map(challenge => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => addToArray('biggest_challenges', challenge, 'customChallenge')}
                    disabled={formData.biggest_challenges.includes(challenge)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      formData.biggest_challenges.includes(challenge)
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 hover:bg-orange-50 text-gray-700'
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Histórico de Saúde */}
        {activeSection === 'health' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Saúde</h2>
            
            {/* Condições Médicas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições Médicas / Problemas de Saúde
              </label>
              {formData.medical_conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.medical_conditions.map((condition, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeFromArray('medical_conditions', condition)}
                        className="ml-2 hover:text-red-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.medicalConditions.map(condition => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => addToArray('medical_conditions', condition, 'customCondition')}
                    disabled={formData.medical_conditions.includes(condition)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      formData.medical_conditions.includes(condition)
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 hover:bg-red-50 text-gray-700'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Condições Crônicas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições Crônicas
              </label>
              {formData.chronic_conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.chronic_conditions.map((condition, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeFromArray('chronic_conditions', condition)}
                        className="ml-2 hover:text-yellow-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicamentos em Uso
                </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Liste todos os medicamentos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alergias
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Liste todas as alergias..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Histórico de Lesões
                </label>
                <textarea
                  name="injuries_history"
                  value={formData.injuries_history}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Histórico de Cirurgias
                </label>
                <textarea
                  name="surgeries_history"
                  value={formData.surgeries_history}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section: Estilo de Vida */}
        {activeSection === 'lifestyle' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estilo de Vida</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estilo de Vida Geral
                </label>
                <select
                  name="lifestyle"
                  value={formData.lifestyle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="sedentary">Sedentário</option>
                  <option value="moderate">Moderado</option>
                  <option value="active">Ativo</option>
                  <option value="very_active">Muito Ativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas de Sono
                </label>
                <select
                  name="sleep_hours"
                  value={formData.sleep_hours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="<5">Menos de 5 horas</option>
                  <option value="5-6">5-6 horas</option>
                  <option value="6-7">6-7 horas</option>
                  <option value="7-8">7-8 horas</option>
                  <option value="8-9">8-9 horas</option>
                  <option value=">9">Mais de 9 horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualidade do Sono
                </label>
                <select
                  name="sleep_quality"
                  value={formData.sleep_quality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="poor">Má</option>
                  <option value="fair">Razoável</option>
                  <option value="good">Boa</option>
                  <option value="excellent">Excelente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Stress
                </label>
                <select
                  name="stress_level"
                  value={formData.stress_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="very_low">Muito Baixo</option>
                  <option value="low">Baixo</option>
                  <option value="moderate">Moderado</option>
                  <option value="high">Alto</option>
                  <option value="very_high">Muito Alto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hidratação Diária
                </label>
                <select
                  name="hydration"
                  value={formData.hydration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="<1L">Menos de 1L</option>
                  <option value="1-1.5L">1 - 1.5L</option>
                  <option value="1.5-2L">1.5 - 2L</option>
                  <option value="2-2.5L">2 - 2.5L</option>
                  <option value="2.5-3L">2.5 - 3L</option>
                  <option value=">3L">Mais de 3L</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consumo de Álcool
                </label>
                <select
                  name="alcohol_consumption"
                  value={formData.alcohol_consumption}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="never">Nunca</option>
                  <option value="rarely">Raramente</option>
                  <option value="occasional">Ocasional</option>
                  <option value="moderate">Moderado</option>
                  <option value="frequent">Frequente</option>
                  <option value="daily">Diário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tabagismo
                </label>
                <select
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="never">Nunca fumou</option>
                  <option value="former">Ex-fumador</option>
                  <option value="occasional">Fumador ocasional</option>
                  <option value="regular">Fumador regular</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section: Nutrição */}
        {activeSection === 'nutrition' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrição</h2>
            
            {/* Restrições Alimentares */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restrições Alimentares
              </label>
              {formData.dietary_restrictions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.dietary_restrictions.map((restriction, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {restriction}
                      <button
                        type="button"
                        onClick={() => removeFromArray('dietary_restrictions', restriction)}
                        className="ml-2 hover:text-amber-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.dietaryRestrictions.map(restriction => (
                  <button
                    key={restriction}
                    type="button"
                    onClick={() => addToArray('dietary_restrictions', restriction, 'customRestriction')}
                    disabled={formData.dietary_restrictions.includes(restriction)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      formData.dietary_restrictions.includes(restriction)
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 hover:bg-amber-50 text-gray-700'
                    }`}
                  >
                    {restriction}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência de Refeições
                </label>
                <select
                  name="meal_frequency"
                  value={formData.meal_frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="2-3">2-3 refeições/dia</option>
                  <option value="3-4">3-4 refeições/dia</option>
                  <option value="4-5">4-5 refeições/dia</option>
                  <option value="5-6">5-6 refeições/dia</option>
                  <option value=">6">Mais de 6 refeições/dia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hábitos Alimentares
                </label>
                <textarea
                  name="eating_habits"
                  value={formData.eating_habits}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Suplementos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suplementos
              </label>
              {formData.supplements.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.supplements.map((supplement, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {supplement}
                      <button
                        type="button"
                        onClick={() => removeFromArray('supplements', supplement)}
                        className="ml-2 hover:text-green-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.supplements.map(supplement => (
                  <button
                    key={supplement}
                    type="button"
                    onClick={() => addToArray('supplements', supplement, 'customSupplement')}
                    disabled={formData.supplements.includes(supplement)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      formData.supplements.includes(supplement)
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 hover:bg-green-50 text-gray-700'
                    }`}
                  >
                    {supplement}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Experiência */}
        {activeSection === 'training' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiência e Nível de Treino</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de Atividade Atual *
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {options.activityLevel.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiência em Treino *
                </label>
                <select
                  name="training_experience"
                  value={formData.training_experience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {options.experience.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequência de Treino Desejada
                </label>
                <select
                  name="training_frequency"
                  value={formData.training_frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="1-2">1-2 vezes/semana</option>
                  <option value="3-4">3-4 vezes/semana</option>
                  <option value="5-6">5-6 vezes/semana</option>
                  <option value="7">Todos os dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiência Prévia Detalhada
                </label>
                <textarea
                  name="previous_training_experience"
                  value={formData.previous_training_experience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descreva sua experiência anterior com exercícios..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section: Preferências */}
        {activeSection === 'preferences' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Treino</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário Preferido
                </label>
                <select
                  name="preferred_training_time"
                  value={formData.preferred_training_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {options.trainingTime.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local de Treino
                </label>
                <select
                  name="training_location"
                  value={formData.training_location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="gym">Ginásio</option>
                  <option value="home">Casa</option>
                  <option value="outdoor">Ar livre</option>
                  <option value="studio">Estúdio/Box</option>
                  <option value="online">Online</option>
                  <option value="mixed">Vários locais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferência de Treino em Grupo
                </label>
                <select
                  name="group_training_preference"
                  value={formData.group_training_preference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="solo">Prefiro treinar sozinho</option>
                  <option value="partner">Com um parceiro</option>
                  <option value="small_group">Grupo pequeno (3-5 pessoas)</option>
                  <option value="large_group">Grupo grande (6+ pessoas)</option>
                  <option value="flexible">Indiferente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferência de Género do Trainer
                </label>
                <select
                  name="trainer_gender_preference"
                  value={formData.trainer_gender_preference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="no_preference">Sem preferência</option>
                </select>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidade Semanal
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {options.weekDays.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      value={day}
                      checked={formData.availability.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            availability: [...prev.availability, day]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            availability: prev.availability.filter(d => d !== day)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equipamentos Disponíveis */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamentos Disponíveis
              </label>
              {formData.equipment_available.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.equipment_available.map((equipment, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {equipment}
                      <button
                        type="button"
                        onClick={() => removeFromArray('equipment_available', equipment)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.equipment.map(equipment => (
                  <label key={equipment} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={equipment}
                      checked={formData.equipment_available.includes(equipment)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          addToArray('equipment_available', equipment, 'customEquipment');
                        } else {
                          removeFromArray('equipment_available', equipment);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferências de Comunicação */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferências de Comunicação
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.communicationPrefs.map(pref => (
                  <label key={pref} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={pref}
                      checked={formData.communication_preference.includes(pref)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            communication_preference: [...prev.communication_preference, pref]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            communication_preference: prev.communication_preference.filter(p => p !== pref)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">{pref}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="music_preference"
                checked={formData.music_preference}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Gosto de treinar com música
              </label>
            </div>
          </div>
        )}

        {/* Section: Observações */}
        {activeSection === 'notes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas do Trainer
                </label>
                <textarea
                  name="trainer_notes"
                  value={formData.trainer_notes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Observações importantes sobre o atleta, preferências específicas, etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Internas (Privadas)
                </label>
                <textarea
                  name="internal_notes"
                  value={formData.internal_notes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Notas privadas que não serão compartilhadas com o atleta..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => navigate(`/athletes/${id}`)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                const sections = ['basic', 'physical', 'goals', 'health', 'lifestyle', 'nutrition', 'training', 'preferences', 'notes'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1]);
                }
              }}
              disabled={activeSection === 'basic'}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() => {
                const sections = ['basic', 'physical', 'goals', 'health', 'lifestyle', 'nutrition', 'training', 'preferences', 'notes'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1]);
                }
              }}
              disabled={activeSection === 'notes'}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center px-6 py-2 rounded-lg transition-colors ${
                saving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Anamnese
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAthlete;