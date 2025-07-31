import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import MealPlanBuilder from '../components/MealPlanBuilder';

const EditPlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchPlanData();
  }, [id]);

  const fetchPlanData = async () => {
    // TODO: Substituir com API call
    setTimeout(() => {
      setPlan({
        id: parseInt(id),
        name: 'Plano de Cutting - João Silva',
        athleteId: 1,
        athleteName: 'João Silva',
        targetMacros: {
          calories: 2100,
          protein: 180,
          carbs: 200,
          fat: 60,
          fiber: 30,
          water: 2500
        },
        meals: [
          {
            id: 1,
            name: 'Pequeno-almoço',
            time: '08:00',
            foods: [
              { id: 1, name: 'Aveia', quantity: 50, unit: 'g', protein: 6.5, carbs: 33.5, fat: 3.5, calories: 189 },
              { id: 2, name: 'Claras', quantity: 150, unit: 'g', protein: 15, carbs: 0.45, fat: 0, calories: 63 }
            ],
            supplements: []
          },
          // ... mais refeições
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-28'
      });
      setLoading(false);
    }, 1000);
  };

  const handleSavePlan = async (mealData) => {
    const updatedPlan = {
      ...plan,
      meals: mealData.meals,
      totals: mealData.totals,
      updatedAt: new Date().toISOString()
    };

    console.log('Plano atualizado:', updatedPlan);
    
    // TODO: API call para atualizar
    // await nutritionAPI.updatePlan(id, updatedPlan);
    
    // Mostrar mensagem de sucesso e redirecionar
    navigate('/nutrition/plans');
  };

  const handleDeletePlan = async () => {
    // TODO: API call para eliminar
    // await nutritionAPI.deletePlan(id);
    
    navigate('/nutrition/plans');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return <div className="p-6">Plano não encontrado</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/nutrition/plans')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Plano Nutricional</h1>
              <p className="text-gray-600">{plan.name}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar Plano
          </button>
        </div>
      </div>

      {/* Plan Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Atleta</p>
            <p className="font-medium text-gray-900">{plan.athleteName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Criado em</p>
            <p className="font-medium text-gray-900">
              {new Date(plan.createdAt).toLocaleDateString('pt-PT')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Última atualização</p>
            <p className="font-medium text-gray-900">
              {new Date(plan.updatedAt).toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>
      </div>

      {/* Meal Plan Builder */}
      <MealPlanBuilder
        targetMacros={plan.targetMacros}
        initialMeals={plan.meals}
        onSave={handleSavePlan}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar Eliminação
              </h3>
              <p className="text-gray-600 mb-6">
                Tem a certeza que deseja eliminar este plano? Esta ação não pode ser revertida.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlanView;