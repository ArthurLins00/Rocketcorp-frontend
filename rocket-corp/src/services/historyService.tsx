import type {
  CollaboratorHistory,
  HistoryResponse,
  PerformanceResponse,
  CyclesResponse,
  PerformanceData,
  EvaluationCycle,
} from "../models/history";

// Backend response interfaces
interface PerformanceDataDto {
  semester: string;
  score: number;
}

interface UserPerformanceResponseDto {
  userId: number;
  userName: string;
  performanceData: PerformanceDataDto[];
}

interface UserEvaluationCyclesResponseDto {
  userId: number;
  userName: string;
  evaluationCycles: EvaluationCycle[];
}

export class HistoryService {
  static async getCollaboratorHistory(
    collaboratorId: string
  ): Promise<HistoryResponse> {
    try {
      // TODO: subtituir pela requisição real quando integrar com o backend

      // MOCK
      const { getCollaboratorHistoryMock } = await import(
        "../mocks/historyMock.tsx"
      );
      return getCollaboratorHistoryMock(collaboratorId);
    } catch (error) {
      console.error("Error fetching collaborator history:", error);
      return {
        success: false,
        data: {} as CollaboratorHistory,
        message: "Erro ao carregar histórico do colaborador",
      };
    }
  }

  static async getPerformanceData(
    collaboratorId: string
  ): Promise<PerformanceResponse> {
    try {
      const apiUrl = `http://localhost:3000/users/${collaboratorId}/performance`;
      const response = await fetch(apiUrl);

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status || "Unknown"}`);
      }

      const backendData: UserPerformanceResponseDto = await response.json();

      // Map backend response to frontend PerformanceData format
      const performanceData: PerformanceData[] =
        backendData.performanceData.map((item: PerformanceDataDto) => ({
          semester: item.semester,
          score: item.score,
        }));

      return {
        success: true,
        data: performanceData,
        message: "Dados de performance carregados com sucesso",
      };
    } catch (error) {
      console.error("Error fetching performance data:", error);
      return {
        success: false,
        data: [],
        message: "Erro ao carregar dados de performance",
      };
    }
  }

  static async getEvaluationCycles(
    collaboratorId: string
  ): Promise<CyclesResponse> {
    try {
      const apiUrl = `http://localhost:3000/users/${collaboratorId}/evaluation-cycles`;
      const response = await fetch(apiUrl);

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status || "Unknown"}`);
      }

      const backendData: UserEvaluationCyclesResponseDto =
        await response.json();

      return {
        success: true,
        data: backendData.evaluationCycles,
        message: "Ciclos de avaliação carregados com sucesso",
      };
    } catch (error) {
      console.error("Error fetching evaluation cycles:", error);
      return {
        success: false,
        data: [],
        message: "Erro ao carregar ciclos de avaliação",
      };
    }
  }
}
