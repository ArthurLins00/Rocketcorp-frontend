import type { Autoavaliacao } from "./Autoavaliacao";
import type { Avaliacao360 } from "./Avaliacao360";
import type { Criterio } from "./Criterio";
import type { Referencia } from "./Referencia";
import type { ResumoIA } from "./ResumoIA";

export type Ciclo = {
  id: number;
  name: string;
  year: number;
  period: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  dataAberturaAvaliacao?: Date | null;
  dataFechamentoAvaliacao?: Date | null;
  dataAberturaRevisaoGestor?: Date | null;
  dataFechamentoRevisaoGestor?: Date | null;
  dataAberturaRevisaoComite?: Date | null;
  dataFechamentoRevisaoComite?: Date | null;
  dataFinalizacao?: Date | null;
  referencias?: Referencia[];
  avaliacoes?: Autoavaliacao[];
  avaliacoes360?: Avaliacao360[];
  criterios?: Criterio[];
  ResumoIA?: ResumoIA[];
};
