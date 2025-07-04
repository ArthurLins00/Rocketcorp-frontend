export const criteriosAutoavaliacao = [
  "sentimentoDeDono",
  "resiliencia",
  "organizacao",
  "aprendizado",
  "teamPlayer",
  "qualidade",
  "prazos",
  "eficiencia",
  "criatividade",
  "gente",
  "resultados",
  "evolucao",
];

// Valida autoavaliação
export function validarFormulario(form: Record<string, any>, criterios: string[]) {
  return criterios.every((id) => {
    const item = form[id];
    return (
      item &&
      typeof item.nota === "number" &&
      item.nota > 0 &&
      typeof item.justificativa === "string" &&
      item.justificativa.trim() !== ""
    );
  });
}

// Valida avaliação 360
export function validarAvaliacao360(avaliacoes: Record<string, any>) {
  const ids = Object.keys(avaliacoes);
  if (ids.length === 0) return false;

  return ids.every((id) => {
    const item = avaliacoes[id];
    return (
      item &&
      typeof item.nota === "number" &&
      item.nota > 0 &&
      typeof item.pontosFortes === "string" &&
      item.pontosFortes.trim() !== "" &&
      typeof item.pontosMelhoria === "string" &&
      item.pontosMelhoria.trim() !== "" &&
      typeof item.nomeProjeto === "string" &&
      item.nomeProjeto.trim() !== "" &&
      (typeof item.periodoMeses === "string" || typeof item.periodoMeses === "number") &&
      String(item.periodoMeses).trim() !== "" &&
      typeof item.trabalhariaNovamente === "number" &&
      item.trabalhariaNovamente > 0
    );
  });
}

// Valida mentoring
export function validarMentoring(dados: any) {
  return (
    dados &&
    dados.idAvaliador &&
    dados.idAvaliado &&
    typeof dados.nota === "number" &&
    dados.nota > 0 &&
    typeof dados.justificativa === "string" &&
    dados.justificativa.trim() !== "" &&
    dados.idCiclo
  );
}

// Valida referências
export function validarReferencias(referencias: Record<string, any>) {
  return Object.values(referencias).every(
    (ref: any) =>
      ref &&
      ref.idAvaliador &&
      ref.idAvaliado &&
      typeof ref.justificativa === "string" &&
      ref.justificativa.trim() !== "" &&
      ref.idCiclo
  );
}
