export type Equalizacao = {
    idEqualizacao: string; 
    idAvaliador: string; 
    idAvaliado: string; 
  
    nomeAvaliado: string;
    cargoAvaliado: string;
  
    notaAutoavaliacao: number;
    notaGestor: number;
    notaAvaliacao360: number;
  
    notaFinal: number | null;
    justificativa: string;
  
    resumoIA: string;
    status: "Pendente" | "Finalizado";
  };
  