import type { Ciclo } from "./Ciclo";
import type { User } from "./User";

export type Referencia = {
  id: number;
  idReferenciador: number;
  idReferenciado: number;
  justificativa: string;
  idCiclo: number;
  createdAt: string;
  updatedAt: string;
  referenciador?: User;
  referenciado?: User;
  ciclo?: Ciclo;
};
