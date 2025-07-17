import type { Avaliacao360 } from "./Avaliacao360";
import type { User } from "./User";

export type AvaliacaoCompleta = {
  id: number;
  idAvaliado: number;
  idAvaliador: number | null;
  idCiclo: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  unidade?: string;
  nota?: number;
  notaGestor?: number;
  justificativa?: string;
  justificativaGestor?: string;
  totalAvaliacoes?: number;
  totalAvaliacoes360?: number;
  createdAt?: string;
  updatedAt?: string;
  avaliado?: {
    id: number;
    name: string;
    email: string;
  };
  avaliadorId?: number | null;
  criterio?: {
    id: number;
    name: string;
    enabled: boolean;
  };
  criterioId?: number;
  mentor?: User;
  mentorId?: number | null;
  mentorados?: User[];
  avaliacoes360Recebidas?: Avaliacao360[];
  avaliacoesRecebidas?: Avaliacao360[];
  trilha?: {
    id: number;
    name: string;
  };
  trilhaId?: number;
};
