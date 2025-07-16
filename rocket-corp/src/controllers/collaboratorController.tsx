import type { Collaborator } from '../models/collaborator';
import { authenticatedFetch } from '../utils/auth';

export const fetchCollaborator = async (id: string): Promise<Collaborator> => {
  const response = await authenticatedFetch(`/users/${id}`);
  if (!response) throw new Error('Erro ao buscar colaborador');
  const user = await response.json();
  return {
    id: user.id,
    name: user.name,
    cargo: user.cargo,
    // ...add other fields as needed
  };
};

export const submitManagerEvaluations = async (
  collaboratorId: string,
  cicloId: string,
  blocks: import('../models/criterions').CriterionBlock[]
): Promise<void> => {
  // Prepare updates array for backend
  const updates = blocks.flatMap(block =>
    block.criteria.map(criterion => ({
      avaliacaoId: Number(criterion.id),
      notaGestor: criterion.managerScore ?? 0,
      justificativaGestor: criterion.managerJustification ?? ''
    }))
  );
  const response = await authenticatedFetch(
    `/avaliacao/gestor/bulk`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        colaboradorId: Number(collaboratorId),
        cicloId: Number(cicloId),
        updates
      })
    }
  );
  if (!response || !response.ok) {
    const error = response ? await response.text() : 'Sem resposta do servidor';
    throw new Error('Erro ao enviar avaliações do gestor: ' + error);
  }
};