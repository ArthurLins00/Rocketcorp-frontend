import type { Avaliacao } from "./Autoavaliacao";
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
  dataAbertura?: Date | null;
  dataFechamento?: Date | null;
  dataFinalizacao?: Date | null;
  dataRevisaoGestor?: Date | null;
  dataRevisaoComite?: Date | null;
  referencias?: Referencia[];
  avaliacoes?: Avaliacao[];
  avaliacoes360?: Avaliacao360[];
  criterios?: Criterio[];
  ResumoIA?: ResumoIA[];
};
