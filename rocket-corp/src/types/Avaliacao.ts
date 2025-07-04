import type { Ciclo } from "./Ciclo";
import type { Criterio } from "./Criterio";
import type { User } from "./User";

export type Avaliacao = {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number | null;
  justificativa: string;
  criterioId?: number | null;
  notaGestor?: number | null;
  justificativaGestor?: string | null;
  createdAt: string;
  updatedAt: string;
  avaliador?: User;
  avaliado?: User;
  ciclo?: Ciclo;
  criterio?: Criterio | null;
};
