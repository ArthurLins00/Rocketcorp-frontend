import React from 'react';
import { useParams } from 'react-router-dom';
import { CollaboratorScore } from '../../components/history/CollaboratorScore';
import { CollaboratorGrowth } from '../../components/history/CollaboratorGrowth';
import { CollaboratorTotalEvaluations } from '../../components/history/CollaboratorTotalEvaluations';
import { CollaboratorPerformanceChart } from '../../components/history/CollaboratorPerformanceChart';
import { EvaluationCycles } from '../../components/history/EvaluationCycles';
import { useHistoryController } from '../../controllers/historyController';
import type { Cycle } from './EvaluationPage';

interface HistoricoPageProps {
  collaboratorId?: string; // Optional prop for when used as component
  ciclo?: Cycle;
}

export const HistoricoPage: React.FC<HistoricoPageProps> = ({ 
  collaboratorId: propCollaboratorId
}) => {
  const { id } = useParams<{ id: string }>();
  const collaboratorId = propCollaboratorId || id || 'collab-123'; // Use prop first, then route param, then fallback
  
  const { history, performanceData, evaluationCycles, loading, error, refreshData } = useHistoryController(collaboratorId);

  // Loading state
  if (loading) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refreshData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!history) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Nenhum dado de histórico encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-7 min-h-screen">
      {/* First Row - 3 cards horizontally */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="h-[109px]">
          <CollaboratorScore 
            score={history.currentScore}
            semester={history.currentSemester}
          />
        </div>
        <div className="h-[109px]">
          <CollaboratorGrowth 
            currentScore={history.currentScore}
            lastScore={history.lastScore}
            lastCycle={history.lastSemester}
          />
        </div>
        <div className="h-[109px]">
          <CollaboratorTotalEvaluations 
            totalEvaluations={history.totalEvaluations}
          />
        </div>
      </div>

      {/* Second Row - Performance Chart */}
      <div className="mb-5">
        <div className="h-96">
          <CollaboratorPerformanceChart 
            data={performanceData}
          />
        </div>
      </div>

      {/* Third Row - Evaluation Cycles */}
      <div>
        <div className="h-[550px]">
          <EvaluationCycles 
            cycles={evaluationCycles}
          />
        </div>
      </div>
    </div>
  );
};