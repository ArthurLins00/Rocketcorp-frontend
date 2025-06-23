export type Criterion = {
    id: string;
    name: string;
    weight: string;
    description: string;
    required: boolean;
  };
  
  export type CriterionGroupBase = {
    title: string;
    criteria: Criterion[];
  };
  
  export const criteriosBaseGroups: CriterionGroupBase[] = [
    {
      title: "Critérios de Postura",
      criteria: [
        {
          id: "sentimentoDeDono",
          name: "Sentimento de Dono",
          weight: "20%",
          description:
            "Assume responsabilidade pelos resultados, demonstrando comprometimento e iniciativa para o sucesso do projeto.",
          required: true,
        },
        {
          id: "resiliencia",
          name: "Resiliência nas adversidades",
          weight: "15%",
          description:
            "Mantém a calma e persevera diante de desafios e obstáculos, buscando soluções e aprendizado.",
          required: true,
        },
        {
          id: "organizacao",
          name: "Organização do trabalho",
          weight: "15%",
          description:
            "Planeja e estrutura suas atividades de forma eficiente para cumprir prazos e metas.",
          required: false,
        },
        {
          id: "aprendizado",
          name: "Capacidade de aprender",
          weight: "10%",
          description:
            "Busca constantemente adquirir novos conhecimentos e habilidades para aprimorar seu desempenho.",
          required: false,
        },
        {
          id: "teamPlayer",
          name: "Ser 'team player'",
          weight: "10%",
          description:
            "Colabora efetivamente com a equipe, valorizando o trabalho coletivo e contribuindo para um ambiente positivo.",
          required: false,
        },
      ],
    },
    {
      title: "Critérios de Execução",
      criteria: [
        {
          id: "qualidade",
          name: "Entregar com qualidade",
          weight: "20%",
          description:
            "Produz resultados que atendem ou superam os padrões esperados, com atenção aos detalhes.",
          required: true,
        },
        {
          id: "prazos",
          name: "Atender aos prazos",
          weight: "15%",
          description:
            "Cumpre os prazos estabelecidos, gerenciando o tempo de forma eficaz para entregar no momento certo.",
          required: true,
        },
        {
          id: "eficiencia",
          name: "Fazer mais com menos",
          weight: "15%",
          description:
            "Utiliza recursos de forma inteligente para maximizar a produtividade e minimizar desperdícios.",
          required: false,
        },
        {
          id: "criatividade",
          name: "Pensar fora da caixa",
          weight: "10%",
          description:
            "Propõe soluções inovadoras e alternativas que agregam valor ao projeto e à equipe.",
          required: false,
        },
      ],
    },
    {
      title: "Critérios de Gente e Gestão",
      criteria: [
        {
          id: "gente",
          name: "Gente",
          weight: "15%",
          description:
            "Demonstra habilidade em liderar, motivar e desenvolver pessoas para alcançar objetivos comuns.",
          required: true,
        },
        {
          id: "resultados",
          name: "Resultados",
          weight: "15%",
          description:
            "Foca na entrega de resultados tangíveis que impactam positivamente a organização.",
          required: true,
        },
        {
          id: "evolucao",
          name: "Evolução da Rocket Corp",
          weight: "10%",
          description:
            "Contribui para o crescimento contínuo da empresa, alinhando ações aos valores e metas estratégicas.",
          required: false,
        },
      ],
    },
  ];
  