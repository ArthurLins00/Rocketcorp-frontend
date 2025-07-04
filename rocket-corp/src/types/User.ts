import type { Avaliacao } from "./Avaliacao";
import type { Avaliacao360 } from "./Avaliacao360";
import type { Referencia } from "./Referencia";
import type { ResumoIA } from "./ResumoIA";
import type { Trilha } from "./Trilha";

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  unidade?: string | null;
  createdAt: string; // ou Date, dependendo do backend
  updatedAt: string; // ou Date
  mentorId?: number | null;
  mentor?: User | null;
  mentorados?: User[];
  avaliadorId?: number | null;
  trilhaId?: number | null;
  trilha?: Trilha | null;
  avaliacoesFeitas?: Avaliacao[];
  avaliacoesRecebidas?: Avaliacao[];
  avaliacoes360Feitas?: Avaliacao360[];
  avaliacoes360Recebidas?: Avaliacao360[];
  referenciasFeitas?: Referencia[];
  referenciasRecebidas?: Referencia[];
  ResumoIA?: ResumoIA[];
};
