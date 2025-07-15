// const API_URL = "/api/users";
export async function buscarDadosDashboardUser(idUser: number) {
  const response = await fetch(`http://localhost:3000/users/${idUser}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do dashboard");
  }
  return response.json();
}

export async function buscarAvaliacoesDoAvaliador(idUser: number) {
  const response = await fetch(
    `http://localhost:3000/avaliacao/avaliador/${idUser}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do dashboard");
  }
  return response.json();
}

export async function buscarAutoavaliacoes() {
  const response = await fetch(`http://localhost:3000/avaliacao`);
  if (!response.ok) {
    throw new Error("Erro ao buscar avaliacoes");
  }
  return response.json();
}

export async function buscarAvaliacoes360() {
  const response = await fetch(`http://localhost:3000/avaliacao/360`);
  if (!response.ok) {
    throw new Error("Erro ao buscar avaliacoes");
  }
  return response.json();
}

export async function buscarMentoring() {
  const response = await fetch(`http://localhost:3000/avaliacao/360`);
  if (!response.ok) {
    throw new Error("Erro ao buscar avaliacoes");
  }
  return response.json();
}

export async function buscarDadosCiclo(idUser: number, idCiclo: number) {
  const response = await fetch(
    `http://localhost:3000/avaliacao/analytics/user/${idUser}/ciclo/${idCiclo}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do dashboard");
  }
  return response.json();
}

export async function buscarCicloAtual() {
  const response = await fetch(`http://localhost:3000/cicle/current`);
  return response.json();
}

export async function buscarMentorados(idMentor: number) {
  const response = await fetch(
    `http://localhost:3000/users/${idMentor}/mentorados`
  );
  return response.json();
}

export async function buscaAllUsers() {
  const response = await fetch(`http://localhost:3000/users`);
  return response.json();
}

export async function buscarAllMentores() {
  const response = await fetch(`http://localhost:3000/users/mentores`);
  return response.json();
}
