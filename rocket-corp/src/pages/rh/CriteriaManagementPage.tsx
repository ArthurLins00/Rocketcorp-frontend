import { useEffect, useRef, useState } from "react";
import TrilhaFilterBar from "../../components/rh/TrilhaFilterBar";
import TrilhaSection from "../../components/rh/TrilhaSection";
import { criteriosBaseGroups ,  type Criterion }  from "../../mocks/criteriosBase";
import { trilhasMock, type Trilha } from "../../mocks/trilhasMock";

import { buscarTrilhasDoBackend, enviarTrilhasParaBackend } from "../../services/trilhaService";

type CriterionGroup = {
  groupName: string;
  criteria: Criterion[];
};

export type TrilhaCompleta = Omit<Trilha, "criteriaGroups"> & {
  criteriaGroups: CriterionGroup[];
};

const LOCAL_STORAGE_KEY = "rocketCorp.trilhas";

export default function CriteriaManagementPage() {
  const [trilhas, setTrilhas] = useState<TrilhaCompleta[]>([]);
  const trilhaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Criar mapa de critérios base
  const criteriosMap: Record<string, Criterion> = criteriosBaseGroups
    .flatMap((group) => group.criteria)
    .reduce((acc, criterio) => {
      acc[criterio.id] = criterio;
      return acc;
    }, {} as Record<string, Criterion>);

  // Função para expandir os ids para os objetos completos
  function expandCriteria(trilhas: Trilha[]): TrilhaCompleta[] {
    return trilhas.map((trilha) => ({
      ...trilha,
      criteriaGroups: trilha.criteriaGroups.map((group) => ({
        groupName: group.groupName,
        criteria: group.criteriaIds.map((id) => criteriosMap[id]),
      })),
    }));
  }

  useEffect(() => {
    buscarTrilhasDoBackend()
      .then((dados) => setTrilhas(dados))
      .catch(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) setTrilhas(JSON.parse(stored));
        else setTrilhas(expandCriteria(trilhasMock));
      });
  }, []);

  const handleCriterionChange = (
    trilhaId: string,
    groupName: string,
    updatedCriterion: Criterion
  ) => {
    setTrilhas((prev) =>
      prev.map((trilha) => {
        if (trilha.id !== trilhaId) return trilha;
        return {
          ...trilha,
          criteriaGroups: trilha.criteriaGroups.map((group) => {
            if (group.groupName !== groupName) return group;
            return {
              ...group,
              criteria: group.criteria.map((criterion) =>
                criterion.id === updatedCriterion.id ? updatedCriterion : criterion
              ),
            };
          }),
        };
      })
    );
  };

  const handleToggleExpand = (id: string) => {
    setTrilhas((prev) =>
      prev.map((trilha) =>
        trilha.id === id ? { ...trilha, expanded: !trilha.expanded } : trilha
      )
    );
  };

  const handleSelectTrilha = (trilhaId: string) => {
    setTrilhas((prev) =>
      prev.map((t) => (t.id === trilhaId ? { ...t, expanded: true } : t))
    );
    setTimeout(() => {
      const ref = trilhaRefs.current[trilhaId];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSave = async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trilhas));
    try {
      await enviarTrilhasParaBackend(trilhas);
      alert("Alterações salvas com sucesso no backend e localmente!");
    } catch (error) {
      alert("Erro ao salvar no backend. Alterações salvas localmente.");
      console.error(error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#08605F]">Critérios de Avaliação</h1>
        <button
          onClick={handleSave}
          className="bg-[#08605F] hover:bg-[#054845] text-white font-medium py-2 px-4 rounded"
        >
          Salvar alterações
        </button>
      </div>

      <TrilhaFilterBar
        trilhas={trilhas.map(({ id, nome }) => ({ id, nome }))}
        onSelectTrilha={handleSelectTrilha}
      />

      <div className="space-y-4">
        {trilhas.map((trilha) => (
          <TrilhaSection
            key={trilha.id}
            trilha={trilha}
            onToggleExpand={handleToggleExpand}
            onCriterionChange={(updatedCriterion, groupName) =>
              handleCriterionChange(trilha.id, groupName, updatedCriterion)
            }
            refProp={(el) => {
              trilhaRefs.current[trilha.id] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
