// src/components/athletes/AthleteForm.js
import React, { useState, useEffect } from 'react';
import { 
  Save, X, User, Mail, Phone, Calendar, Ruler, Weight, 
  Target, MapPin, AlertCircle, CheckCircle, ArrowLeft, 
  ArrowRight, Upload, Camera
} from 'lucide-react';

const AthleteForm = ({ 
  athlete = null, 
  onSave, 
  onCancel, 
  isLoading = false 
}) => {
  // Estado do formulário multi-step
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      profilePhoto: null,
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    healthInfo: {
      height: '',
      currentWeight: '',
      targetWeight: '',
      medicalConditions: [],
      medications: [],
      allergies: [],
      injuries: [],
      fitnessLevel: 'beginner'
    },
    goals: {
      primary: '',
      secondary: [],
      targetDate: '',
      description: ''
    },
    membership: {
      plan: 'standard',
      monthlyFee: 59.99,
      startDate: new Date().toISOString().split('T')[0]
    }
  });

  // Estados para validação e UI
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuração dos steps
  const steps = [
    { 
      id: 1, 
      title: 'Informações Pessoais', 
      description: 'Dados básicos do atleta',
      fields: ['personalInfo.name', 'personalInfo.email', 'personalInfo.phone', 'personalInfo.dateOfBirth', 'personalInfo.gender']
    },
    { 
      id: 2, 
      title: 'Informações de Saúde', 
      description: 'Dados físicos e médicos',
      fields: ['healthInfo.height', 'healthInfo.currentWeight', 'healthInfo.targetWeight', 'healthInfo.fitnessLevel']
    },
    { 
      id: 3, 
      title: 'Objetivos', 
      description: 'Metas e planos de treino',
      fields: ['goals.primary', 'goals.targetDate']
    },
    { 
      id: 4, 
      title: 'Plano de Membership', 
      description: 'Tipo de plano e valores',
      fields: ['membership.plan', 'membership.monthlyFee']
    }
  ];

  // Carregar dados do atleta se estiver editando
  useEffect(() => {
    if (athlete) {
      setFormData(athlete);
    }
  }, [athlete]);

  // Função para atualizar dados do formulário
  const updateFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Marcar campo como touched
    setTouched(prev => ({ ...prev, [path]: true }));
    
    // Limpar erro se existir
    if (errors[path]) {
      setErrors(prev => ({ ...prev, [path]: null }));
    }
  };

  // Validação de campos
  const validateField = (path, value) => {
    const validations = {
      'personalInfo.name': {
        required: true,
        minLength: 2,
        message: 'Nome deve ter pelo menos 2 caracteres'
      },
      'personalInfo.email': {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email deve ser válido'
      },
      'personalInfo.phone': {
        required: true,
        pattern: /^[+]?[0-9\s\-()]+$/,
        message: 'Telefone deve ser válido'
      },
      'personalInfo.dateOfBirth': {
        required: true,
        custom: (val) => {
          const age = new Date().getFullYear() - new Date(val).getFullYear();
          return age >= 16 && age <= 100;
        },
        message: 'Atleta deve ter entre 16 e 100 anos'
      },
      'healthInfo.height': {
        required: true,
        min: 100,
        max: 250,
        message: 'Altura deve estar entre 100cm e 250cm'
      },
      'healthInfo.currentWeight': {
        required: true,
        min: 30,
        max: 300,
        message: 'Peso deve estar entre 30kg e 300kg'
      },
      'healthInfo.targetWeight': {
        required: true,
        min: 30,
        max: 300,
        message: 'Peso objetivo deve estar entre 30kg e 300kg'
      },
      'goals.primary': {
        required: true,
        message: 'Objetivo principal é obrigatório'
      }
    };

    const validation = validations[path];
    if (!validation) return null;

    if (validation.required && (!value || value.toString().trim() === '')) {
      return 'Este campo é obrigatório';
    }

    if (validation.minLength && value.length < validation.minLength) {
      return validation.message;
    }

    if (validation.pattern && !validation.pattern.test(value)) {
      return validation.message;
    }

    if (validation.min && parseFloat(value) < validation.min) {
      return validation.message;
    }

    if (validation.max && parseFloat(value) > validation.max) {
      return validation.message;
    }

    if (validation.custom && !validation.custom(value)) {
      return validation.message;
    }

    return null;
  };

  // Validar step atual
  const validateCurrentStep = () => {
    const currentStepConfig = steps[currentStep - 1];
    const stepErrors = {};
    let isValid = true;

    currentStepConfig.fields.forEach(field => {
      const keys = field.split('.');
      let value = formData;
      keys.forEach(key => {
        value = value[key];
      });

      const error = validateField(field, value);
      if (error) {
        stepErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return isValid;
  };

  // Navegar entre steps
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submeter formulário
  const handleSubmit = async () => {
    // Validar todos os campos obrigatórios
    const allErrors = {};
    steps.forEach(step => {
      step.fields.forEach(field => {
        const keys = field.split('.');
        let value = formData;
        keys.forEach(key => {
          value = value[key];
        });

        const error = validateField(field, value);
        if (error) {
          allErrors[field] = error;
        }
      });
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Voltar ao primeiro step com erro
      const firstErrorStep = steps.find(step => 
        step.fields.some(field => allErrors[field])
      );
      if (firstErrorStep) {
        setCurrentStep(firstErrorStep.id);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente do indicador de progresso
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.id 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'border-gray-300 text-gray-500'
          }`}>
            {currentStep > step.id ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{step.id}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`h-1 w-16 mx-2 ${
              currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Componente de campo de input
  const InputField = ({ 
    label, 
    type = 'text',
    path,
    placeholder,
    required = false,
    icon: Icon,
    options = null,
    ...props
  }) => {
    const keys = path.split('.');
    let value = formData;
    keys.forEach(key => {
      value = value[key];
    });

    const error = errors[path];
    const isTouched = touched[path];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          )}
          
          {type === 'select' ? (
            <select
              value={value || ''}
              onChange={(e) => updateFormData(path, e.target.value)}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error && isTouched ? 'border-red-500' : 'border-gray-300'
              }`}
              {...props}
            >
              <option value="">Selecione...</option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={value || ''}
              onChange={(e) => updateFormData(path, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                error && isTouched ? 'border-red-500' : 'border-gray-300'
              }`}
              {...props}
            />
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => updateFormData(path, e.target.value)}
              placeholder={placeholder}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error && isTouched ? 'border-red-500' : 'border-gray-300'
              }`}
              {...props}
            />
          )}
        </div>
        
        {error && isTouched && (
          <div className="mt-2 flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  };

  // Step 1: Informações Pessoais
  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
        <p className="text-gray-600">Dados básicos do atleta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nome Completo"
          path="personalInfo.name"
          placeholder="Ex: João Silva"
          required
          icon={User}
        />

        <InputField
          label="Email"
          type="email"
          path="personalInfo.email"
          placeholder="joao@email.com"
          required
          icon={Mail}
        />

        <InputField
          label="Telefone"
          type="tel"
          path="personalInfo.phone"
          placeholder="+351 912 345 678"
          required
          icon={Phone}
        />

        <InputField
          label="Data de Nascimento"
          type="date"
          path="personalInfo.dateOfBirth"
          required
          icon={Calendar}
        />

        <InputField
          label="Género"
          type="select"
          path="personalInfo.gender"
          required
          options={[
            { value: 'male', label: 'Masculino' },
            { value: 'female', label: 'Feminino' },
            { value: 'other', label: 'Outro' }
          ]}
        />

        <InputField
          label="Morada"
          path="personalInfo.address"
          placeholder="Rua, número, cidade"
          icon={MapPin}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Contacto de Emergência</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Nome"
            path="personalInfo.emergencyContact.name"
            placeholder="Nome do contacto"
          />
          <InputField
            label="Telefone"
            path="personalInfo.emergencyContact.phone"
            placeholder="Telefone"
          />
          <InputField
            label="Relação"
            path="personalInfo.emergencyContact.relationship"
            placeholder="Ex: Cônjuge, Familiar"
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Informações de Saúde
  const HealthInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Informações de Saúde</h2>
        <p className="text-gray-600">Dados físicos e médicos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Altura (cm)"
          type="number"
          path="healthInfo.height"
          placeholder="175"
          required
          icon={Ruler}
          min="100"
          max="250"
        />

        <InputField
          label="Peso Atual (kg)"
          type="number"
          path="healthInfo.currentWeight"
          placeholder="70"
          required
          icon={Weight}
          min="30"
          max="300"
          step="0.1"
        />

        <InputField
          label="Peso Objetivo (kg)"
          type="number"
          path="healthInfo.targetWeight"
          placeholder="65"
          required
          icon={Target}
          min="30"
          max="300"
          step="0.1"
        />
      </div>

      <InputField
        label="Nível de Fitness"
        type="select"
        path="healthInfo.fitnessLevel"
        required
        options={[
          { value: 'beginner', label: 'Iniciante - Pouca ou nenhuma experiência' },
          { value: 'intermediate', label: 'Intermédio - Alguma experiência regular' },
          { value: 'advanced', label: 'Avançado - Experiência consistente' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condições Médicas
          </label>
          <textarea
            value={formData.healthInfo.medicalConditions.join('\n')}
            onChange={(e) => updateFormData('healthInfo.medicalConditions', e.target.value.split('\n').filter(Boolean))}
            placeholder="Liste condições médicas relevantes (uma por linha)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicamentos
          </label>
          <textarea
            value={formData.healthInfo.medications.join('\n')}
            onChange={(e) => updateFormData('healthInfo.medications', e.target.value.split('\n').filter(Boolean))}
            placeholder="Liste medicamentos atuais (uma por linha)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alergias
          </label>
          <textarea
            value={formData.healthInfo.allergies.join('\n')}
            onChange={(e) => updateFormData('healthInfo.allergies', e.target.value.split('\n').filter(Boolean))}
            placeholder="Liste alergias conhecidas (uma por linha)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesões Anteriores
          </label>
          <textarea
            value={formData.healthInfo.injuries.join('\n')}
            onChange={(e) => updateFormData('healthInfo.injuries', e.target.value.split('\n').filter(Boolean))}
            placeholder="Liste lesões relevantes (uma por linha)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Objetivos
  const GoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Objetivos</h2>
        <p className="text-gray-600">Metas e planos de treino</p>
      </div>

      <InputField
        label="Objetivo Principal"
        type="select"
        path="goals.primary"
        required
        icon={Target}
        options={[
          { value: 'weight_loss', label: 'Perda de Peso' },
          { value: 'muscle_gain', label: 'Ganho de Massa Muscular' },
          { value: 'strength', label: 'Aumento de Força' },
          { value: 'endurance', label: 'Melhoria da Resistência' },
          { value: 'flexibility', label: 'Flexibilidade' },
          { value: 'general_fitness', label: 'Condicionamento Geral' },
          { value: 'rehabilitation', label: 'Reabilitação' },
          { value: 'sports_performance', label: 'Performance Desportiva' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Data Objetivo"
          type="date"
          path="goals.targetDate"
          required
          icon={Calendar}
          min={new Date().toISOString().split('T')[0]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivos Secundários
          </label>
          <textarea
            value={formData.goals.secondary.join('\n')}
            onChange={(e) => updateFormData('goals.secondary', e.target.value.split('\n').filter(Boolean))}
            placeholder="Liste objetivos secundários (uma por linha)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <InputField
        label="Descrição Detalhada"
        type="textarea"
        path="goals.description"
        placeholder="Descreva em detalhes os objetivos, motivações e expectativas do atleta..."
      />
    </div>
  );

  // Step 4: Membership
  const MembershipStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Plano de Membership</h2>
        <p className="text-gray-600">Tipo de plano e valores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Tipo de Plano"
          type="select"
          path="membership.plan"
          required
          options={[
            { value: 'basic', label: 'Básico - €39.99/mês' },
            { value: 'standard', label: 'Standard - €59.99/mês' },
            { value: 'premium', label: 'Premium - €89.99/mês' },
            { value: 'vip', label: 'VIP - €129.99/mês' }
          ]}
        />

        <InputField
          label="Valor Mensal (€)"
          type="number"
          path="membership.monthlyFee"
          placeholder="59.99"
          required
          min="0"
          step="0.01"
        />

        <InputField
          label="Data de Início"
          type="date"
          path="membership.startDate"
          required
          icon={Calendar}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Resumo do Plano</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Plano:</strong> {formData.membership.plan.charAt(0).toUpperCase() + formData.membership.plan.slice(1)}</p>
          <p><strong>Valor:</strong> €{formData.membership.monthlyFee}/mês</p>
          <p><strong>Início:</strong> {formData.membership.startDate ? new Date(formData.membership.startDate).toLocaleDateString('pt-PT') : 'Não definido'}</p>
        </div>
      </div>
    </div>
  );

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <HealthInfoStep />;
      case 3: return <GoalsStep />;
      case 4: return <MembershipStep />;
      default: return <PersonalInfoStep />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {athlete ? 'Editar Atleta' : 'Novo Atleta'}
        </h1>
        <p className="text-gray-600">
          {athlete ? 'Atualize as informações do atleta' : 'Adicione um novo atleta ao seu sistema'}
        </p>
      </div>

      {/* Indicador de progresso */}
      <StepIndicator />

      {/* Formulário */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderCurrentStep()}

        {/* Botões de navegação */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoading}
                className="px-6 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 rounded-lg flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {athlete ? 'Atualizar' : 'Salvar'} Atleta
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

export default AthleteForm;