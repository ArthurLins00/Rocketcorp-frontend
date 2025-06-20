import { useEffect, useState } from "react";
import { Star } from "lucide-react";


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

type FormState = {
  [key: string]: {
    rating: number;
    justification: string;
  };
};

const LOCAL_STORAGE_KEY = "autoavaliacao";

const getInitialResponses = (): FormState => {
  const allCriteria: FormState = {};
  sections.forEach((section) => {
    section.criteria.forEach((criterion) => {
      allCriteria[criterion.id] = { rating: 0, justification: "" };
    });
  });

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      return {
        ...allCriteria,
        ...parsed,
      };
    }
  }

  return allCriteria;
};

export default function AutoavaliacaoForm() {
  const [responses, setResponses] = useState<FormState>(getInitialResponses);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const handleRating = (id: string, rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        rating,
      },
    }));
  };

  const handleJustification = (id: string, justification: string) => {
    setResponses((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        justification,
      },
    }));
  };

  const renderSection = (sectionTitle: string, criteria: Criterion[]) => {
    const filledCount = criteria.filter((c) => responses[c.id]?.rating).length;
    const total = criteria.length;
    const average =
      filledCount > 0
        ? (
            criteria.reduce(
              (acc, c) => acc + (responses[c.id]?.rating || 0),
              0
            ) / filledCount
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
          const rating = responses[criterion.id]?.rating || 0;

          return (
            <div
              key={criterion.id}
              className="border rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{criterion.label}</p>
                <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                  {rating.toFixed(1)}
                </span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= rating ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => handleRating(criterion.id, star)}
                  />
                ))}
              </div>

              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Justifique sua nota"
                value={responses[criterion.id]?.justification || ""}
                onChange={(e) =>
                  handleJustification(criterion.id, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-12">
      {sections.map((section) =>
        renderSection(section.title, section.criteria)
      )}
    </div>
  );
}
