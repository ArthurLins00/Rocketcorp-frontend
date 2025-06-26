export type Trilha = {
    id: string;
    nome: string;
    expanded: boolean;
    criteriaGroups: {
      groupName: string;
      criteriaIds: string[];
    }[];
  };
  
  export const trilhasMock: Trilha[] = [
    {
      id: "financeiro",
      nome: "Trilha de Financeiro",
      expanded: false,
      criteriaGroups: [
        {
          groupName: "Critérios de Postura",
          criteriaIds: [
            "sentimentoDeDono", "resiliencia", "organizacao", "aprendizado", "teamPlayer"
          ],
        },
        {
          groupName: "Critérios de Execução",
          criteriaIds: ["qualidade", "prazos", "eficiencia", "criatividade"]
        },
        {
          groupName: "Critérios de Gente e Gestão",
          criteriaIds: ["gente", "resultados", "evolucao"]
        },
      ],
    },
    {
      id: "design",
      nome: "Trilha de Design",
      expanded: false,
      criteriaGroups: [
        {
          groupName: "Critérios de Postura",
          criteriaIds: ["sentimentoDeDono", "resiliencia", "organizacao", "aprendizado", "teamPlayer"]
        },
        {
          groupName: "Critérios de Execução",
          criteriaIds: ["qualidade", "prazos", "eficiencia", "criatividade"]
        },
        {
          groupName: "Critérios de Gente e Gestão",
          criteriaIds: ["gente", "resultados", "evolucao"]
        },
      ],
    },
    {
      id: "marketing",
      nome: "Trilha de Marketing",
      expanded: false,
      criteriaGroups: [
        {
          groupName: "Critérios de Postura",
          criteriaIds: ["sentimentoDeDono", "resiliencia", "organizacao", "aprendizado", "teamPlayer"]
        },
        {
          groupName: "Critérios de Execução",
          criteriaIds: ["qualidade", "prazos", "eficiencia", "criatividade"]
        },
        {
          groupName: "Critérios de Gente e Gestão",
          criteriaIds: ["gente", "resultados", "evolucao"]
        },
      ],
    },
  ];
  