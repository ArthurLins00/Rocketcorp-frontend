export type Equalizacao = {
  idEqualizacao: string;
  idAvaliador: string;
  idAvaliado: string;

  nomeAvaliado: string;
  cargoAvaliado: string;

  notaAutoavaliacao: number | null;
  notaGestor: number | null;
  notaAvaliacao360: number | null;

  notaFinal: number | null;
  justificativa: string | null;

  resumoIA: string;
  status: "Pendente" | "Finalizado";
};

export type CreateEqualizacaoDto = {
  idCiclo: number;
  idAvaliador: number;
  idAvaliado: number;
  notaFinal: number;
  justificativa: string;
};
