import React from 'react';
import type { EvaluationCycle } from '../../models/history';

interface EvaluationCyclesProps {
  cycles: EvaluationCycle[];
}
const getScoreColor = (score: number) => {
  if (score > 4) return '#219653'; // Green
  if (score > 2.5) return '#F2C94C'; // Yellow
  return '#E74C3C'; // Red
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'finalizado':
      return { text: 'Finalizado', bgColor: 'bg-[#219653]/20', textColor: 'text-[#219653]' };
    case 'em-andamento':
      return { text: 'Em andamento', bgColor: 'bg-[#F2C94C]/20', textColor: 'text-[#F2C94C]' };
    default:
      return { text: 'Desconhecido', bgColor: 'bg-gray-200', textColor: 'text-gray-600' };
  }
};

const EvaluationCycleItem: React.FC<{ cycle: EvaluationCycle }> = ({ cycle }) => {
  const statusConfig = getStatusConfig(cycle.status);
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Ciclo {cycle.cycle}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
            {statusConfig.text}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Nota final</div>
          <div className="text-lg font-bold text-gray-800">
            {cycle.finalScore ? cycle.finalScore.toFixed(1) : '-'}
          </div>
        </div>
      </div>

      {/* Score Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Autoavaliação */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Autoavaliação</span>
            <span 
              className="text-sm font-bold"
              style={{ color: getScoreColor(cycle.scores.autoavaliacao) }}
            >
              {cycle.scores.autoavaliacao.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(cycle.scores.autoavaliacao / 5) * 100}%`,
                backgroundColor: getScoreColor(cycle.scores.autoavaliacao)
              }}
            ></div>
          </div>
        </div>

        {/* Execução */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Avaliação final - Execução</span>
            <span 
              className="text-sm font-bold"
              style={{ color: getScoreColor(cycle.scores.execucao) }}
            >
              {cycle.scores.execucao.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(cycle.scores.execucao / 5) * 100}%`,
                backgroundColor: getScoreColor(cycle.scores.execucao)
              }}
            ></div>
          </div>
        </div>

        {/* Postura */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Avaliação final - Postura</span>
            <span 
              className="text-sm font-bold"
              style={{ color: getScoreColor(cycle.scores.postura) }}
            >
              {cycle.scores.postura.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(cycle.scores.postura / 5) * 100}%`,
                backgroundColor: getScoreColor(cycle.scores.postura)
              }}
            ></div>
          </div>
        </div>

        {/* Gestão (optional) */}
        {cycle.scores.gestao && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Avaliação Final - Gestão</span>
              <span 
                className="text-sm font-bold"
                style={{ color: getScoreColor(cycle.scores.gestao) }}
              >
                {cycle.scores.gestao.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${(cycle.scores.gestao / 5) * 100}%`,
                  backgroundColor: getScoreColor(cycle.scores.gestao)
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="flex gap-3 bg-gray-50 rounded-lg p-4">
        <div 
          className="w-1 rounded-full"
          style={{ backgroundColor: '#08605F' }}
        ></div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Resumo</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {cycle.resumo}
          </p>
        </div>
      </div>
    </div>
  );
};

export const EvaluationCycles: React.FC<EvaluationCyclesProps> = ({ cycles }) => {
  return (
    <div className="bg-white rounded-lg p-6 h-full flex flex-col">
      <div className="mb-6">
        <span className="text-lg font-bold text-gray-800">Ciclos de Avaliação</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {cycles.map((cycle) => (
            <EvaluationCycleItem key={cycle.id} cycle={cycle} />
          ))}
        </div>
      </div>
    </div>
  );
};
