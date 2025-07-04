import type { Avaliacao } from "../types/Avaliacao";
import type { Avaliacao360 } from "../types/Avaliacao360";
import type { User } from "../types/User";

export function calcularPorcentagemTodosTipos(
  mentorados: User[],
  autoAvaliacoes: Avaliacao[],
  avaliacoes360: Avaliacao360[]
): number {
  const total = mentorados.length;
  if (total === 0) return 0;

  console.log("na funcao calcular porcentagem:", mentorados);
  console.log(autoAvaliacoes);
  console.log(avaliacoes360);

  const mentoradosComTodos = mentorados.filter((mentorado) => {
    const fezAuto = autoAvaliacoes.some(
      (avaliacao) => avaliacao.idAvaliado === mentorado.id
    );
    const fez360 = avaliacoes360.some(
      (avaliacao) => avaliacao.idAvaliado === mentorado.id
    );
    // const fezMentoring = avaliacoes.some(
    //   (avaliacao) =>
    //     avaliacao.idAvaliado === mentorado.id &&
    //     avaliacao.tipoAvaliacao === "mentoring"
    // );
    return fezAuto && fez360;
  });

  return Math.round((mentoradosComTodos.length / total) * 100);
}

export function calcularNumAvalPendentesAvaliador(
  mentorados: User[],
  avaliacoes360: Avaliacao360[],
  idAvaliado: number
): number {
  const total = mentorados.length;
  console.log(avaliacoes360);

  const mentoradosComTodos = mentorados.filter((mentorado) => {
    // Verifica se existe uma avaliação 360 feita pelo mentorado para o gestor
    const fez360 = avaliacoes360.some(
      (avaliacao) =>
        avaliacao.idAvaliador === mentorado.id &&
        avaliacao.idAvaliado === idAvaliado
    );
    return fez360;
  });

  return Math.round(total - mentoradosComTodos.length);
}

export function calcularAvalPendentesComite(
  users: User[],
  autoAvaliacao: Avaliacao[],
  avaliacoes360: Avaliacao360[]
): number {
  const total = users.length;
  if (total === 0) return 0;

  const usersComAvaliacaoPreenc = users.filter((user) => {
    // Verifica se o user fez autoavaliação
    const fezAuto = autoAvaliacao.some(
      (avaliacao) => avaliacao.idAvaliador === user.id
    );

    // Verifica se o user fez avaliação 360
    const fez360 = avaliacoes360.some(
      (avaliacao) => avaliacao.idAvaliador === user.id
    );

    // Retorna true se fez ambos os tipos de avaliação
    return fezAuto && fez360;
  });

  return Math.round((usersComAvaliacaoPreenc.length / total) * 100);
}
