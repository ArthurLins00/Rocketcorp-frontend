import type { CriterionBlock } from '../models/criterions';
import { authenticatedFetch } from '../utils/auth';

export const fetchCriteriaBlocks = async (colaboradorId: string, cicloId: string): Promise<CriterionBlock[]> => {
  const response = await authenticatedFetch(`/avaliacao/gestor/colaborador/${colaboradorId}/ciclo/${cicloId}`);
  if (!response) throw new Error('Erro ao buscar blocos de critérios');
  return await response.json();
};

export const submitManagerEvaluations = async (blocks: CriterionBlock[]): Promise<void> => {
  console.log('Manager evaluations submitted:', blocks);
  return new Promise(resolve => setTimeout(resolve, 300));
};
