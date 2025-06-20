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

  export function validarFormulario(form: Record<string, any>, criterios: string[]) {
    return criterios.every(
      (id) =>
        form[id]?.rating > 0 && form[id]?.justification?.trim() !== ""
    );
  }

  export function validarAvaliacao360(avaliacoes: Record<string, any>) {
    const ids = Object.keys(avaliacoes);
    if (ids.length === 0) return false;

    return ids.every((id) => {
      const item = avaliacoes[id];
      return (
        item &&
        item.rating > 0 &&
        item.pontosFortes?.trim() !== "" &&
        item.pontosMelhoria?.trim() !== ""
      );
    });
  }

  export function validarMentoring(dados: any) {
    return (
      dados.mentorId &&
      dados.rating > 0 &&
      dados.justificativa?.trim() !== ""
    );
  }

  export function validarReferencias(referencias: Record<string, any>) {
    return Object.values(referencias).every(
      (ref: any) => ref.justificativa?.trim() !== ""
    );
  }