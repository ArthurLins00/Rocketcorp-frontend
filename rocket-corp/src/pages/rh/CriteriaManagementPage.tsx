import { useEffect, useRef, useState } from "react";
import TrilhaFilterBar from "../../components/rh/TrilhaFilterBar";
import TrilhaSection from "../../components/rh/TrilhaSection";
import { criteriosBaseGroups , type Criterion } from "../../mocks/criteriosBase";
import { trilhasMock, type Trilha } from "../../mocks/trilhasMock";
import ErrorModal from "../../components/ErrorModal";

import { buscarTrilhasDoBackend, enviarTrilhasParaBackend } from "../../services/trilhaService";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";

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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const criteriosMap: Record<string, Criterion> = criteriosBaseGroups
    .flatMap((group) => group.criteria)
    .reduce((acc, criterio) => {
      acc[criterio.id] = criterio;
      return acc;
    }, {} as Record<string, Criterion>);

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

  const handleAddCriterion = (trilhaId: string, groupName: string) => {
    setTrilhas(prevTrilhas =>
      prevTrilhas.map(trilha => {
        if (trilha.id !== trilhaId) return trilha;

        return {
          ...trilha,
          criteriaGroups: trilha.criteriaGroups.map(group => {
            if (group.groupName !== groupName) return group;

            const newCriterion: Criterion = {
              id: `new-${Date.now()}`,
              name: "Novo critério",
              weight: "0",
              description: "",
              required: false,
            };

            return {
              ...group,
              criteria: [...group.criteria, newCriterion],
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

  // Função que salva mesmo — só chamada após confirmação
  const confirmSave = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);
  
    const isValid = trilhas.every((trilha) =>
      trilha.criteriaGroups.every((group) => {
        const total = group.criteria
          .filter((c) => c.required)
          .reduce((sum, c) => sum + parseFloat(c.weight || "0"), 0);
        return total === 100;
      })
    );
  
    if (!isValid) {
      setShowErrorModal(true);
      setIsSaving(false);
      return;
    }
  
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trilhas));
  
    try {
      await enviarTrilhasParaBackend(trilhas);
      setShowSuccessModal(true); // <- agora exibe o modal de sucesso
    } catch (error: any) {
      const msg = error?.message || "Erro ao enviar dados para o backend.";
      setErrorMessage(msg);
      setShowErrorModal(true);
    }
  
    setIsSaving(false);
  };
  

  // Abre modal para confirmar salvamento
  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#08605F]">Critérios de Avaliação</h1>
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`text-white font-medium py-2 px-4 rounded ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#08605F] hover:bg-[#054845]"
          }`}
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
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
            onAddCriterion={handleAddCriterion}
            refProp={(el) => {
              trilhaRefs.current[trilha.id] = el;
            }}
          />
        ))}
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage || "Todos os grupos devem ter exatamente 100% de peso nos critérios habilitados."}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmSave}
        title="Você está quase lá!"
        description="Você tem certeza que deseja salvar as alterações?"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Sucesso"
        description="As alterações foram salvas com sucesso."
      />
    </div>
  );
}