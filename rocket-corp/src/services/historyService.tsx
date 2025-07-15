import type { 
  CollaboratorHistory, 
  HistoryResponse, 
  PerformanceResponse, 
  CyclesResponse 
} from '../models/history';


export class HistoryService {
  static async getCollaboratorHistory(collaboratorId: string): Promise<HistoryResponse> {
    try {
      // TODO: subtituir pela requisição real quando integrar com o backend

      // MOCK
      const { getCollaboratorHistoryMock } = await import('../mocks/historyMock.tsx');
      return getCollaboratorHistoryMock(collaboratorId);
      
    } catch (error) {
      console.error('Error fetching collaborator history:', error);
      return {
        success: false,
        data: {} as CollaboratorHistory,
        message: 'Erro ao carregar histórico do colaborador'
      };
    }
  }

  static async getPerformanceData(collaboratorId: string): Promise<PerformanceResponse> {
    try {

      const { getPerformanceDataMock } = await import('../mocks/historyMock.tsx');
      return getPerformanceDataMock(collaboratorId);
      
    } catch (error) {
      console.error('Error fetching performance data:', error);
      return {
        success: false,
        data: [],
        message: 'Erro ao carregar dados de performance'
      };
    }
  }

  static async getEvaluationCycles(collaboratorId: string): Promise<CyclesResponse> {
    try {
     
      const { getEvaluationCyclesMock } = await import('../mocks/historyMock.tsx');
      return getEvaluationCyclesMock(collaboratorId);
      
    } catch (error) {
      console.error('Error fetching evaluation cycles:', error);
      return {
        success: false,
        data: [],
        message: 'Erro ao carregar ciclos de avaliação'
      };
    }
  }
}
