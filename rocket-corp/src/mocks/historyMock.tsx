import type { 
  CollaboratorHistory, 
  HistoryResponse, 
  PerformanceResponse, 
  CyclesResponse,
  EvaluationCycle,
  PerformanceData 
} from '../models/history';

const mockPerformanceData: PerformanceData[] = [
  { semester: '2023.1', score: 3.6 },
  { semester: '2023.2', score: 3.8 },
  { semester: '2024.1', score: 4.1 },
  { semester: '2024.2', score: 4.2 },
];

const mockEvaluationCycles: EvaluationCycle[] = [
  {
    id: '1',
    cycle: '2025.1',
    status: 'em-andamento',
    scores: {
      autoavaliacao: 4.2,
      execucao: 3.8,
      postura: 4.5,
      gestao: 4.1
    },
    resumo: 'Colaborador demonstrando boa evolução na autoavaliação e excelente postura profissional. Área de execução com potencial de melhoria.',
    period: 'Jan - Jun 2025',
    completionDate: 'Em andamento'
  },
  {
    id: '2',
    cycle: '2024.2',
    status: 'finalizado',
    finalScore: 4.2,
    scores: {
      autoavaliacao: 4.0,
      execucao: 4.3,
      postura: 4.4,
      gestao: 4.1
    },
    resumo: 'Ciclo com ótimos resultados em todas as dimensões. Colaborador demonstrou crescimento significativo na execução de tarefas.',
    period: 'Jul - Dez 2024',
    completionDate: '15 Dez 2024'
  },
  {
    id: '3',
    cycle: '2024.1',
    status: 'finalizado',
    finalScore: 3.8,
    scores: {
      autoavaliacao: 3.6,
      execucao: 4.1,
      postura: 3.7
    },
    resumo: 'Desempenho equilibrado com destaque para execução. Recomendado trabalhar autoconhecimento e postura em situações de pressão.',
    period: 'Jan - Jun 2024',
    completionDate: '20 Jun 2024'
  },
  {
    id: '4',
    cycle: '2023.2',
    status: 'finalizado',
    finalScore: 3.8,
    scores: {
      autoavaliacao: 3.5,
      execucao: 4.0,
      postura: 3.9
    },
    resumo: 'Colaborador manteve consistência no desempenho. Demonstrou melhoria na execução de projetos.',
    period: 'Jul - Dez 2023',
    completionDate: '18 Dez 2023'
  }
];

const mockCollaboratorHistory: CollaboratorHistory = {
  id: '1',
  collaboratorId: 'collab-123',
  currentScore: 4.2,
  currentSemester: '2024.2',
  lastScore: 3.6,
  lastSemester: '2023.2',
  growth: 0.6,
  totalEvaluations: 24,
  performanceData: mockPerformanceData,
  evaluationCycles: mockEvaluationCycles
};


// TODO: trocar pra integrar com o backend

export const getCollaboratorHistoryMock = async (collaboratorId: string): Promise<HistoryResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!collaboratorId) {
    return {
      success: false,
      data: {} as CollaboratorHistory,
      message: 'ID do colaborador é obrigatório'
    };
  }

  return {
    success: true,
    data: {
      ...mockCollaboratorHistory,
      collaboratorId
    }
  };
};

export const getPerformanceDataMock = async (collaboratorId: string): Promise<PerformanceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!collaboratorId) {
    return {
      success: false,
      data: [],
      message: 'ID do colaborador é obrigatório'
    };
  }

  return {
    success: true,
    data: mockPerformanceData
  };
};

export const getEvaluationCyclesMock = async (collaboratorId: string): Promise<CyclesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (!collaboratorId) {
    return {
      success: false,
      data: [],
      message: 'ID do colaborador é obrigatório'
    };
  }

  return {
    success: true,
    data: mockEvaluationCycles
  };
};
