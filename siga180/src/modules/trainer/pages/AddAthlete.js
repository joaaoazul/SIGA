// src/modules/trainer/pages/AddAthlete.js
// PÁGINA DE ESCOLHA COM TEMA DO DASHBOARD

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Send, Users } from 'lucide-react';

const AddAthlete = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header consistente com dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/athletes')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Adicionar Novo Atleta</h1>
              <p className="text-sm text-gray-500 mt-0.5">Escolha como adicionar um atleta à sua equipa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Cards de Opções */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Opção 1: Criar Manual */}
            <div
              onMouseEnter={() => setHoveredCard('manual')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate('/athletes/create')}
              className={`
                relative bg-white rounded-xl p-8 cursor-pointer transition-all duration-200
                ${hoveredCard === 'manual' 
                  ? 'shadow-xl scale-105 border-2 border-blue-500' 
                  : 'shadow-md border-2 border-gray-100 hover:shadow-lg'
                }
              `}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  RECOMENDADO
                </span>
              </div>

              {/* Ícone */}
              <div className={`
                w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors
                ${hoveredCard === 'manual' ? 'bg-blue-500' : 'bg-blue-100'}
              `}>
                <UserPlus className={`
                  h-7 w-7 transition-colors
                  ${hoveredCard === 'manual' ? 'text-white' : 'text-blue-600'}
                `} />
              </div>

              {/* Texto */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Perfil Completo
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Crie o perfil do atleta agora e preencha todos os dados da anamnese. 
                Ideal para atletas presenciais ou quando tem todos os dados.
              </p>

              {/* Benefícios */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Perfil completo imediato
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Controlo total dos dados
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Sem necessidade de email
                </div>
              </div>
            </div>

            {/* Opção 2: Enviar Convite */}
            <div
              onMouseEnter={() => setHoveredCard('invite')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate('/athletes/athletformwithmag')}
              className={`
                relative bg-white rounded-xl p-8 cursor-pointer transition-all duration-200
                ${hoveredCard === 'invite' 
                  ? 'shadow-xl scale-105 border-2 border-green-500' 
                  : 'shadow-md border-2 border-gray-100 hover:shadow-lg'
                }
              `}
            >
              {/* Ícone */}
              <div className={`
                w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors
                ${hoveredCard === 'invite' ? 'bg-green-500' : 'bg-green-100'}
              `}>
                <Send className={`
                  h-7 w-7 transition-colors
                  ${hoveredCard === 'invite' ? 'text-white' : 'text-green-600'}
                `} />
              </div>

              {/* Texto */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Convite por Email
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Envie um link mágico para o atleta completar o próprio perfil. 
                Perfeito para atletas online ou à distância.
              </p>

              {/* Benefícios */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Atleta preenche os dados
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Processo automatizado
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Link seguro e temporário
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas ou Info Adicional */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dica Pro</p>
                  <p className="text-xs text-gray-500">
                    Use o perfil completo para atletas presenciais e o convite para atletas online
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/athletes')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Ver todos os atletas →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAthlete;