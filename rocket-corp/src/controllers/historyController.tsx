import { useState, useEffect } from 'react';
import { HistoryService } from '../services/historyService';
import type { 
  CollaboratorHistory, 
  PerformanceData, 
  EvaluationCycle 
} from '../models/history';

export interface HistoryState {
  history: CollaboratorHistory | null;
  performanceData: PerformanceData[];
  evaluationCycles: EvaluationCycle[];
  loading: boolean;
  error: string | null;
}

export const useHistoryController = (collaboratorId: string) => {
  const [state, setState] = useState<HistoryState>({
    history: null,
    performanceData: [],
    evaluationCycles: [],
    loading: true,
    error: null
  });

  const loadHistoryData = async () => {
    if (!collaboratorId) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'ID do colaborador não fornecido'
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // talvez chamar 1 só endpoint que retorna tudo
      
      const [historyResponse, performanceResponse, cyclesResponse] = await Promise.all([
        HistoryService.getCollaboratorHistory(collaboratorId),
        HistoryService.getPerformanceData(collaboratorId),
        HistoryService.getEvaluationCycles(collaboratorId)
      ]);

      if (!historyResponse.success) {
        throw new Error(historyResponse.message || 'Erro ao carregar histórico');
      }

      if (!performanceResponse.success) {
        throw new Error(performanceResponse.message || 'Erro ao carregar dados de performance');
      }

      if (!cyclesResponse.success) {
        throw new Error(cyclesResponse.message || 'Erro ao carregar ciclos de avaliação');
      }

      setState({
        history: historyResponse.data,
        performanceData: performanceResponse.data,
        evaluationCycles: cyclesResponse.data,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading history data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao carregar dados'
      }));
    }
  };

  const refreshData = () => {
    loadHistoryData();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    loadHistoryData();
  }, [collaboratorId]);

  return {
    ...state,
    refreshData,
    clearError
  };
};


export const HistoryUtils = {

  calculateGrowth: (currentScore: number, lastScore: number): number => {
    return Number((currentScore - lastScore).toFixed(1));
  },

  getScoreColor: (score: number): string => {
    if (score > 4) return '#219653'; // Green
    if (score > 2.5) return '#F2C94C'; // Yellow
    return '#E74C3C'; // Red
  },

  getScoreDescription: (score: number): string => {
    if (score >= 4.5) return 'Excelente';
    if (score >= 4) return 'Muito bom';
    if (score >= 3.5) return 'Bom';
    if (score >= 2.5) return 'Regular';
    return 'Precisa melhorar';
  },

  formatCycle: (cycle: string): string => {
    return `Ciclo ${cycle}`;
  },

  hasManagementEvaluation: (cycle: EvaluationCycle): boolean => {
    return cycle.scores.gestao !== undefined && cycle.scores.gestao !== null;
  }
};
