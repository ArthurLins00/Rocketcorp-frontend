import type { Ciclo } from "./Ciclo";
import type { User } from "./User";

export type ResumoIA = {
  id: number;
  userId: number;
  idCiclo: number;
  resumo: string;
  user?: User;
  ciclo?: Ciclo;
  createdAt: string;
  updatedAt: string;
};
