export interface EvaluationScore {
  autoavaliacao: number;
  execucao: number;
  postura: number;
  gestao?: number;
}

export interface EvaluationCycle {
  id: string;
  cycle: string;
  status: 'em-andamento' | 'finalizado';
  finalScore?: number;
  scores: EvaluationScore;
  resumo: string;
  period: string;
  completionDate?: string;
}

export interface CollaboratorHistory {
  id: string;
  collaboratorId: string;
  currentScore: number;
  currentSemester: string;
  lastScore: number;
  lastSemester: string; 
  growth: number; // currentScore - lastScore
  totalEvaluations: number;
  performanceData: PerformanceData[];
  evaluationCycles: EvaluationCycle[];
}

export interface PerformanceData {
  semester: string; 
  score: number;
}

export interface HistoryResponse {
  success: boolean;
  data: CollaboratorHistory;
  message?: string;
}

export interface PerformanceResponse {
  success: boolean;
  data: PerformanceData[];
  message?: string;
}

export interface CyclesResponse {
  success: boolean;
  data: EvaluationCycle[];
  message?: string;
}
