import type { CriterionBlock } from '../models/criterions';
import { criteriaBlocks } from '../mocks/criteria';
export const fetchCriteriaBlocks = async (): Promise<CriterionBlock[]> => {
  return new Promise(resolve => setTimeout(() => resolve(criteriaBlocks), 300));
};
export const submitManagerEvaluations = async (blocks: CriterionBlock[]): Promise<void> => {
  console.log('Manager evaluations submitted:', blocks);
  return new Promise(resolve => setTimeout(resolve, 300));
};
