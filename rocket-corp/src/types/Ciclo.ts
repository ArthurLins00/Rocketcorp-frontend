export type Cycle = {
  id: number;
  name: string;
  year: number;
  period: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  dataAberturaAvaliacao?: Date | null;
  dataFechamentoAvaliacao?: Date | null;
  dataAberturaRevisaoGestor?: Date | null;
  dataFechamentoRevisaoGestor?: Date | null;
  dataAberturaRevisaoComite?: Date | null;
  dataFechamentoRevisaoComite?: Date | null;
  dataFinalizacao?: Date | null;
  //corrigir esses tipos quando integrar
  avaliacoes?: unknown[]; // Avaliacao[]
  avaliacoes360?: unknown[]; // Avaliacao360[]
  criterios?: unknown[]; // Criterio[]
  referencias?: unknown[]; // referencia[]
  ResumoIA?: unknown[]; // ResumoIA[]
};
