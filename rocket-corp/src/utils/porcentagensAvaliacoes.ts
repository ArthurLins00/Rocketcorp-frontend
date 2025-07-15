import type { Autoavaliacao } from "../types/Autoavaliacao";
import type { Avaliacao360 } from "../types/Avaliacao360";
import type { User } from "../types/User";

export function calcularPorcentagemTodosTipos(
  liderados: User[],
  autoAvaliacoes: Autoavaliacao[]
): number {
  const total = liderados.length;
  if (total === 0) return 0;

  console.log("na funcao calcular porcentagem:", liderados);
  console.log(autoAvaliacoes);

  const lideradosComTodos = liderados.filter((liderado) => {
    const fezAuto = autoAvaliacoes.some(
      (avaliacao) => avaliacao.idUser === liderado.id
    );

    return fezAuto;
  });

  return Math.round((lideradosComTodos.length / total) * 100);
}

export function calcularNumAvalPendentesAvaliador(
  liderados: User[],
  avaliacoes360: Avaliacao360[],
  idAvaliado: number,
  mentores: User[]
): number {
  const total = liderados.length;
  console.log(avaliacoes360);

  const lideradosComTodos = liderados.filter((liderado) => {
    // Verifica se existe uma avaliação 360 feita pelo liderado para o gestor
    const fez360 = avaliacoes360.some(
      (avaliacao) =>
        avaliacao.idAvaliador === liderado.id &&
        avaliacao.idAvaliado === idAvaliado
    );
    return fez360;
  });
  // o -1 no final se refere à propria pessoa
  return Math.round(total - lideradosComTodos.length - mentores.length - 1);
}

export function calcularAvalPendentesComite(
  users: User[],
  autoAvaliacao: Autoavaliacao[],
  mentores: User[]
): number {
  const total = users.length;
  if (total === 0) return 0;

  const usersComAvaliacaoPreenc = users.filter((user) => {
    // Verifica se o user fez autoavaliação
    const fezAuto = autoAvaliacao.some(
      (avaliacao) => avaliacao.idUser === user.id
    );
    return fezAuto;
  });

  return Math.round(
    ((usersComAvaliacaoPreenc.length - 1) / (total - mentores.length - 1)) * 100
  );
}
