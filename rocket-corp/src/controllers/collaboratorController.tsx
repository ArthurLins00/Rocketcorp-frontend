import type { Collaborator } from '../models/collaborator';
import { mockCollaborator } from '../mocks/collaborator';
export const fetchCollaborator = async (): Promise<Collaborator> => {
  // TODO: trocar pelo seu endpoint real de API
  return new Promise(resolve => setTimeout(() => resolve(mockCollaborator), 300));
};
export const submitManagerEvaluations = async (): Promise<void> => {
  // TODO: trocar pelo endpoint real de envio
  console.log('Enviar avaliações do gestor:', mockCollaborator.id);
  return new Promise(resolve => setTimeout(resolve, 300));
};