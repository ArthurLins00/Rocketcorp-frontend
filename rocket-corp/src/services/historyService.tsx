import type {
  CollaboratorHistory,
  HistoryResponse,
  PerformanceResponse,
  CyclesResponse,
  PerformanceData,
  EvaluationCycle,
} from "../models/history";
import { authenticatedFetch } from "../utils/auth";

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

interface UserHistoryResponseDto {
  userId: number;
  userName: string;
  currentScore: number;
  currentSemester: string;
  lastScore: number;
  lastSemester: string;
  growth: number;
  totalEvaluations: number;
  performanceData: PerformanceDataDto[];
  evaluationCycles: EvaluationCycle[];
}

export class HistoryService {
  static async getCollaboratorHistory(
    collaboratorId: string
  ): Promise<HistoryResponse> {
    try {
      const apiUrl = `/users/${collaboratorId}/history`;
      const response = await authenticatedFetch(apiUrl);

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status || "Unknown"}`);
      }

      const backendData: UserHistoryResponseDto = await response.json();

      // Map backend response to frontend CollaboratorHistory format
      const collaboratorHistory: CollaboratorHistory = {
        id: backendData.userId.toString(),
        collaboratorId: collaboratorId,
        currentScore: backendData.currentScore,
        currentSemester: backendData.currentSemester,
        lastScore: backendData.lastScore,
        lastSemester: backendData.lastSemester,
        growth: backendData.growth,
        totalEvaluations: backendData.totalEvaluations,
        performanceData: backendData.performanceData.map(
          (item: PerformanceDataDto) => ({
            semester: item.semester,
            score: item.score,
          })
        ),
        evaluationCycles: backendData.evaluationCycles,
      };

      return {
        success: true,
        data: collaboratorHistory,
        message: "Histórico do colaborador carregado com sucesso",
      };
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
      const apiUrl = `/users/${collaboratorId}/performance`;
      const response = await authenticatedFetch(apiUrl);

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
      const apiUrl = `/users/${collaboratorId}/evaluation-cycles`;
      const response = await authenticatedFetch(apiUrl);

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
