import type { Collaborator } from '../models/collaborator';
import { mockCollaborator } from '../mocks/collaborator';

export const fetchCollaborator = async (id: string): Promise<Collaborator> => {
  // TODO: trocar pelo seu endpoint real de API
  // Example: const response = await fetch(`/api/collaborators/${id}`);
  // return await response.json();
  console.log('Fetching collaborator with ID:', id);
  return new Promise(resolve => setTimeout(() => resolve(mockCollaborator), 300));
};

export const submitManagerEvaluations = async (collaboratorId: string): Promise<void> => {
  // TODO: trocar pelo endpoint real de envio
  console.log('Enviar avaliações do gestor para colaborador:', collaboratorId);
  return new Promise(resolve => setTimeout(resolve, 300));
};