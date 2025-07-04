import type { Ciclo } from "./Ciclo";
import type { User } from "./User";

export type MotivacaoTrabalhoNovamente =
  | "DISCORDO_TOTALMENTE"
  | "DISCORDO_PARCIALMENTE"
  | "INDIFERENTE"
  | "CONCORDO_PARCIALMENTE"
  | "CONCORDO_TOTALMENTE";
export type Avaliacao360 = {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number | null;
  pontosFortes: string;
  pontosMelhora: string;
  nomeProjeto: string;
  periodoMeses: number;
  trabalhariaNovamente: MotivacaoTrabalhoNovamente;
  avaliador?: User;
  avaliado?: User;
  ciclo?: Ciclo;
  createdAt: string;
  updatedAt: string;
};
