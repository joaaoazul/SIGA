// src/modules/trainer/pages/Workouts/components/templates/EmptyWorkoutCard.js

import React from 'react';
import { Plus, Zap } from 'lucide-react';

/**
 * Card para iniciar um treino vazio
 * 
 * Permite ao utilizador começar um treino sem template pré-definido,
 * adicionando exercícios on-the-fly durante o treino
 */
const EmptyWorkoutCard = ({ onStart }) => {
  return (
    <button
      onClick={onStart}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Zap className="w-6 h-6" />
        </div>
        <span className="text-lg font-semibold">Start an Empty Workout</span>
      </div>
      <p className="text-sm text-white/80 mt-2">
        Adicione exercícios conforme treina
      </p>
    </button>
  );
};

export default EmptyWorkoutCard;