import type { Avaliacao } from "./Avaliacao";
import type { Ciclo } from "./Ciclo";
import type { Trilha } from "./Trilha";

export type Criterio = {
  id: number;
  name: string;
  tipo: string;
  peso: number;
  description: string;
  idCiclo: number;
  enabled: boolean;
  trilhaId: number;
  ciclo?: Ciclo;
  trilha?: Trilha;
  avaliacoes?: Avaliacao[];
  createdAt: string;
  updatedAt: string;
};
