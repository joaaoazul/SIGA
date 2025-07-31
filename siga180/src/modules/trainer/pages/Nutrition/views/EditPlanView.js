import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  Loader,
  User,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';
import MealPlanBuilder from '../components/MealPlanBuilder';

const EditPlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlanData();
  }, [id]);

  const fetchPlanData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const planRes = await nutritionAPI.getPlan(id);
      // const athleteRes = await nutritionAPI.getAthlete(planRes.data.athleteId);
      
      // Mock data
      const mockPlan = {
        id: parseInt(id),
        name: 'Plano Bulking 3500kcal',
        athleteId: 1,
        status: 'active',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-25',
        targetMacros: {
          calories: 3500,
          protein: 175,
          carbs: 437,
          fat: 117,
          fiber: 35,
          water: 3500
        },
        meals: [
          {
            id: 1,
            name: 'Pequeno-almoço',
            time: '08:00',
            targetPercentage: 20,
            foods: [
              {
                id: 1,
                foodId: 8,
                name: 'Aveia',
                quantity: 100,
                unit: 'g',
                calories: 389,
                protein: 16.9,
                carbs: 66.3,
                fat: 6.9
              },
              {
                id: 2,
                foodId: 18,
                name: 'Banana',
                quantity: 120,
                unit: 'g',
                calories: 107,
                protein: 1.3,
                carbs: 27.4,
                fat: 0.4
              }
            ]
          },
          {
            id: 2,
            name: 'Almoço',
            time: '13:00',
            targetPercentage: 35,
            foods: [
              {
                id: 3,
                foodId: 1,
                name: 'Peito de Frango (grelhado)',
                quantity: 200,
                unit: 'g',
                calories: 330,
                protein: 62,
                carbs: 0,
                fat: 7.2
              },
              {
                id: 4,
                foodId: 6,
                name: 'Arroz Integral (cozido)',
                quantity: 150,
                unit: 'g',
                calories: 168,
                protein: 3.9,
                carbs: 35.3,
                fat: 1.4
              }
            ]
          }
        ]
      };

      const mockAthlete = {
        id: 1,
        name: 'João Silva',
        age: 28,
        weight: 78.5,
        height: 175,
        goal: 'Ganho de Massa'
      };

      setTimeout(() => {
        setPlan(mockPlan);
        setAthlete(mockAthlete);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      setError('Erro ao carregar plano');
      setLoading(false);
    }
  };

  const handleSavePlan = async (updatedPlanData) => {
    setSaving(true);
    
    try {
      const updatedPlan = {
        ...plan,
        meals: updatedPlanData.meals,
        totals: updatedPlanData.totals,
        updatedAt: new Date().toISOString()
      };

      console.log('Plano atualizado:', updatedPlan);
      
      // TODO: API call to update plan
      // await nutritionAPI.updatePlan(id, updatedPlan);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect with success message
      navigate(`/nutrition/athlete/${plan.athleteId}`, { 
        state: { message: 'Plano atualizado com sucesso!' }
      });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      setError('Erro ao guardar alterações');
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // TODO: API call to update plan status
      // await nutritionAPI.updatePlanStatus(id, newStatus);
      
      setPlan(prev => ({ ...prev, status: newStatus }));
      
      if (newStatus === 'inactive') {
        navigate(`/nutrition/athlete/${plan.athleteId}`, {
          state: { message: 'Plano desativado com sucesso!' }
        });
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setError('Erro ao alterar status do plano');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">A carregar plano...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!plan || !athlete) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">Plano não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/nutrition/athlete/${plan.athleteId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao Atleta
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Plano Nutricional</h1>
            <p className="text-gray-600 mt-1">{plan.name}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {plan.status === 'active' ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Ativo
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                Inativo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Athlete Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Atleta</p>
              <p className="font-medium">{athlete.name}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Target className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Objetivo</p>
              <p className="font-medium">{athlete.goal}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Criado em</p>
              <p className="font-medium">
                {new Date(plan.createdAt).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Última atualização</p>
              <p className="font-medium">
                {new Date(plan.updatedAt).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Actions */}
      {plan.status === 'active' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Plano Ativo</p>
                <p className="text-sm text-yellow-700">
                  As alterações serão aplicadas imediatamente ao atleta
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja desativar este plano?')) {
                  handleStatusChange('inactive');
                }
              }}
              className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
            >
              Desativar Plano
            </button>
          </div>
        </div>
      )}

      {/* Meal Plan Builder */}
      <MealPlanBuilder
        targetMacros={plan.targetMacros}
        initialMeals={plan.meals}
        athletePreferences={athlete}
        onSave={handleSavePlan}
      />

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => navigate(`/nutrition/athlete/${plan.athleteId}`)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        
        <div className="flex items-center space-x-4">
          {saving && (
            <div className="flex items-center text-blue-600">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">A guardar alterações...</span>
            </div>
          )}
          
          <button
            onClick={() => {
              const duplicatePlan = {
                ...plan,
                name: `${plan.name} (Cópia)`,
                status: 'draft',
                id: null
              };
              navigate('/nutrition/plans/create', { 
                state: { duplicateFrom: duplicatePlan } 
              });
            }}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Duplicar Plano
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanView;