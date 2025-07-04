import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export type AutoavaliacaoItem = {
  idAvaliador: string;
  idAvaliado: string;
  idCiclo: string;
  criterioId: string;
  nota: number;
  justificativa: string;
};

type AutoavaliacaoState = {
  [criterioId: string]: AutoavaliacaoItem;
};

type Criterion = {
  id: string;
  label: string;
};

const sections: { title: string; criteria: Criterion[] }[] = [
  {
    title: "Critérios de Postura",
    criteria: [
      { id: "sentimentoDeDono", label: "Sentimento de Dono" },
      { id: "resiliencia", label: "Resiliência nas adversidades" },
      { id: "organizacao", label: "Organização do trabalho" },
      { id: "aprendizado", label: "Capacidade de aprender" },
      { id: "teamPlayer", label: "Ser 'team player'" },
    ],
  },
  {
    title: "Critérios de Execução",
    criteria: [
      { id: "qualidade", label: "Entregar com qualidade" },
      { id: "prazos", label: "Atender aos prazos" },
      { id: "eficiencia", label: "Fazer mais com menos" },
      { id: "criatividade", label: "Pensar fora da caixa" },
    ],
  },
  {
    title: "Critérios de Gente e Gestão",
    criteria: [
      { id: "gente", label: "Gente" },
      { id: "resultados", label: "Resultados" },
      { id: "evolucao", label: "Evolução da Rocket Corp" },
    ],
  },
];

const LOCAL_STORAGE_KEY = "autoavaliacao";

const getInitialResponses = (
  idAvaliador: string,
  idCiclo: string
): AutoavaliacaoState => {
  const allCriteria: AutoavaliacaoState = {};
  sections.forEach((section) => {
    section.criteria.forEach((criterion) => {
      allCriteria[criterion.id] = {
        idAvaliador,
        idAvaliado: idAvaliador,
        idCiclo,
        criterioId: criterion.id,
        nota: 0,
        justificativa: "",
      };
    });
  });

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...allCriteria,
        ...parsed,
      };
    }
  } catch {
    return allCriteria;
  }

  return allCriteria;
};

export default function AutoavaliacaoForm({
  idAvaliador,
  idCiclo,
}: {
  idAvaliador: string;
  idCiclo: string;
}) {
  const [responses, setResponses] = useState<AutoavaliacaoState>(() =>
    getInitialResponses(idAvaliador, idCiclo)
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const updateField = (
    criterioId: string,
    field: "nota" | "justificativa",
    value: number | string
  ) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [criterioId]: {
          ...prev[criterioId],
          [field]: value,
        },
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const renderSection = (sectionTitle: string, criteria: Criterion[]) => {
    const filledCount = criteria.filter(
      (c) =>
        responses[c.id]?.nota > 0 &&
        responses[c.id]?.justificativa.trim().length > 0
    ).length;

    const total = criteria.length;

    const average =
      filledCount > 0
        ? (
            criteria.reduce((acc, c) => {
              const item = responses[c.id];
              if (
                item &&
                item.nota > 0 &&
                item.justificativa.trim().length > 0
              ) {
                return acc + item.nota;
              }
              return acc;
            }, 0) / filledCount
          ).toFixed(1)
        : "0.0";

    const getProgressClasses = () => {
      if (filledCount === 0) return "text-red-700 bg-red-100";
      if (filledCount === total) return "text-green-700 bg-green-100";
      return "text-yellow-700 bg-yellow-100";
    };

    return (
      <div key={sectionTitle} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{sectionTitle}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
              {average}
            </span>
            <span
              className={`text-sm px-2 py-1 font-bold rounded ${getProgressClasses()}`}
            >
              {filledCount}/{total} preenchidos
            </span>
          </div>
        </div>

        {criteria.map((criterion) => {
          const item = responses[criterion.id];
          const nota = item?.nota ?? 0;
          const justificativa = item?.justificativa ?? "";

          return (
            <div
              key={criterion.id}
              className="border rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{criterion.label}</p>
                <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                  {nota.toFixed(1)}
                </span>
              </div>
              <label className="block font-small mb-1 text-sm text-gray-500">
                Dê uma avaliação de 1 a 5 com base no critério
              </label>
              <div className="flex gap-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= nota ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => updateField(criterion.id, "nota", star)}
                  />
                ))}
              </div>

              <textarea
                className="w-full p-2 border rounded-lg resize-none"
                placeholder="Justifique sua nota"
                value={justificativa}
                onChange={(e) =>
                  updateField(criterion.id, "justificativa", e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-12 bg-white relative border rounded-xl">
      {sections.map((section) =>
        renderSection(section.title, section.criteria)
      )}
    </div>
  );
}

export function getAutoavaliacoesFormatadas(
  state: AutoavaliacaoState
): AutoavaliacaoItem[] {
  return Object.values(state).filter(
    (item) => item.nota > 0 && item.justificativa.trim().length > 0
  );
}
