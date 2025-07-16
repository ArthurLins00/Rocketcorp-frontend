import { authenticatedFetch } from '../utils/auth';

export interface UserStatistics {
  user: { id: number; name: string; email: string };
  autoavaliacaoAverage: number | null;
  avaliacaoGestorAvg: number | null;
  avaliacao360Avg: number | null;
}

export async function getUsersStatisticsByCiclo(cicloId: number): Promise<UserStatistics[]> {
  const res = await authenticatedFetch(`/users/statistics/ciclo/${cicloId}`);
  if (!res || !res.ok) throw new Error('Erro ao buscar estatísticas dos usuários');
  return res.json();
} 