import { Avaliacao } from "./Avaliacao";
export type Cycle = {
  id: number;
  name: string;
  year: number;
  period: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  dataAbertura?: Date | null;
  dataFechamento?: Date | null;
  dataFinalizacao?: Date | null;
  dataRevisaoGestor?: Date | null;
  dataRevisaoComite?: Date | null;
  avaliacoes?: Avaliacao[]; // Avaliacao[]
  avaliacoes360?: unknown[]; // Avaliacao360[]
  criterios?: unknown[]; // Criterio[]
  referencias?: unknown[]; // referencia[]
  ResumoIA?: unknown[]; // ResumoIA[]
};
