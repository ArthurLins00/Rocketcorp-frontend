import type { CriterionBlock } from '../models/criterions';
export const criteriaBlocks: CriterionBlock[] = [
  {
    id: 'postura',
    name: 'Critérios de Postura',
    criteria: [
      {
        id: 'postura-1',
        name: 'Pontualidade',
        selfScore: 4.5,
        selfJustification: 'Costumo chegar pontualmente a todas as reuniões.',
        managerScore: undefined,
        managerJustification: ''
      },
      {
        id: 'postura-2',
        name: 'Colaboração',
        selfScore: 5,
        selfJustification: 'Sempre auxiliei colegas quando solicitado.',
        managerScore: undefined,
        managerJustification: ''
      }
    ]
  },
  {
    id: 'execucao',
    name: 'Critérios de Execução',
    criteria: [
      {
        id: 'execucao-1',
        name: 'Qualidade de código',
        selfScore: 4,
        selfJustification: 'Busco seguir padrões de código e boas práticas.',
        managerScore: undefined,
        managerJustification: ''
      }
    ]
  },
  {
    id: 'gente-gestao',
    name: 'Critérios de Gente e Gestão',
    criteria: [
      {
        id: 'gente-1',
        name: 'Comunicação',
        selfScore: 3.5,
        selfJustification: 'Mantenho status claros em reuniões de equipe.',
        managerScore: undefined,
        managerJustification: ''
      }
    ]
  }
];