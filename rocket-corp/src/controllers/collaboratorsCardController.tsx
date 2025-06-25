import type { CollaboratorCardProps } from '../models/CollaboratorCardProps';
import { mockCollaboratorCards } from '../mocks/mockedCollaborators';

export async function getAllCards(): Promise<CollaboratorCardProps[]> {
  // simula chamada ao backend
  return new Promise(resolve =>
    setTimeout(() => resolve(mockCollaboratorCards), 200)
  );
}

export async function searchCards(query: string): Promise<CollaboratorCardProps[]> {
  const all = await getAllCards();
  return all.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  );
}