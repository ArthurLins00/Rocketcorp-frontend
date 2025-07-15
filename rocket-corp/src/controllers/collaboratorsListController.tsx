import type { CollaboratorCardProps } from '../models/CollaboratorCardProps';
import { apiFetch } from '../utils/api';

export async function getAllCards(isRhView: boolean): Promise<CollaboratorCardProps[]> {
  // Fetch cicloId from backend
  const cicloRes = await apiFetch('/cicle/current');
  const cicloData = await cicloRes.json();
  const cicloId = cicloData?.id;
  let url = '';
  if (isRhView) {
    url = `/equalizacao/ciclo/${cicloId}`;
  } else {
    url = `/avaliacao/gestor/ciclo/${cicloId}`;
  }
  const res = await apiFetch(url);
  const data = await res.json();

  if (isRhView) {
    return data.map((item: any) => ({
      name: item.nomeAvaliado,
      cargo: item.cargoAvaliado,
      initials: item.nomeAvaliado ? item.nomeAvaliado.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '',
      status: item.status || 'Pendente',
      selfRating: item.notaAutoavaliacao ?? null,
      managerRating: item.notaGestor ?? null,
      avaliacao360: item.notaAvaliacao360 ?? null,
      notaFinal: item.notaFinal ?? null,
    }));
  } else {
    return data.map((item: any) => ({
      name: item.name,
      cargo: item.cargo,
      initials: item.name ? item.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '',
      status: item.meanNota != null && item.meanNotaGestor != null ? 'Finalizado' : 'Em andamento',
      selfRating: item.meanNota ?? null,
      managerRating: item.meanNotaGestor ?? null,
      avaliacao360: null,
      notaFinal: null,
    }));
  }
}

export async function searchCards(query: string, isRhView: boolean): Promise<CollaboratorCardProps[]> {
  const all = await getAllCards(isRhView);
  return all.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  );
}