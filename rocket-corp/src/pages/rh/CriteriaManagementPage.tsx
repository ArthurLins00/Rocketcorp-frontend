import { useEffect, useRef, useState } from "react";
import TrilhaFilterBar from "../../components/rh/TrilhaFilterBar";
import TrilhaSection from "../../components/rh/TrilhaSection";
import ErrorModal from "../../components/ErrorModal";

import {
  buscarTrilhasDoBackend,
  enviarTrilhasParaBackend,
} from "../../services/trilhaService";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";
import type { Trilha, Criterio } from "../../mocks/trilhasMock";

const LOCAL_STORAGE_KEY = "rocketCorp.trilhas";

export default function CriteriaManagementPage() {
  // State now directly uses the new Trilha type
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const trilhaRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); // Changed key to number
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  function transformBackendDataToTrilha(backendTrilhas: Trilha[]): Trilha[] {
    console.log("Raw backend data:", backendTrilhas); // Debug log

    return backendTrilhas.map((trilha) => ({
      ...trilha,
      expanded: false,
    }));
  }

  useEffect(() => {
    buscarTrilhasDoBackend()
      .then((dados) => {
        setTrilhas(transformBackendDataToTrilha(dados));
      })
      .catch((error) => {
        console.error("Error fetching trilhas from backend:", error);
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setTrilhas(transformBackendDataToTrilha(JSON.parse(stored)));
        } else {
          // setTrilhas(transformBackendDataToTrilha(trilhasMock));
        }
      });
  }, []);

  const handleCriterionChange = (
    trilhaId: number,
    groupName: string,
    updatedCriterion: Criterio
  ) => {
    setTrilhas((prev) =>
      prev.map((trilha) => {
        if (trilha.id !== trilhaId) return trilha;
        return {
          ...trilha,
          criteriosGrouped: {
            ...trilha.criteriosGrouped,
            [groupName]: trilha.criteriosGrouped[groupName].map((criterion) =>
              criterion.id === updatedCriterion.id
                ? updatedCriterion
                : criterion
            ),
          },
        };
      })
    );
  };

  const handleAddCriterion = (trilhaId: number, groupName: string) => {
    setTrilhas((prevTrilhas) =>
      prevTrilhas.map((trilha) => {
        if (trilha.id !== trilhaId) return trilha;

        const currentGroupCriteria = trilha.criteriosGrouped[groupName] || [];

        const newCriterion: Criterio = {
          id: Date.now(),
          name: "Novo critério",
          tipo: groupName,
          peso: 0,
          description: "",
          enabled: true,
        };

        return {
          ...trilha,
          criteriosGrouped: {
            ...trilha.criteriosGrouped,
            [groupName]: [...currentGroupCriteria, newCriterion],
          },
        };
      })
    );
  };

  const handleToggleExpand = (id: number) => {
    setTrilhas((prev) =>
      prev.map((trilha) =>
        trilha.id === id ? { ...trilha, expanded: !trilha.expanded } : trilha
      )
    );
  };

  const handleSelectTrilha = (trilhaId: number) => {
    setTrilhas((prev) =>
      prev.map((t) => (t.id === trilhaId ? { ...t, expanded: true } : t))
    );
    setTimeout(() => {
      const ref = trilhaRefs.current[trilhaId];
      if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const confirmSave = async () => {
    setShowConfirmModal(false);

    const isValid = trilhas.every((trilha) => {
      for (const groupName in trilha.criteriosGrouped) {
        if (
          Object.prototype.hasOwnProperty.call(
            trilha.criteriosGrouped,
            groupName
          )
        ) {
          const groupCriteria = trilha.criteriosGrouped[groupName];
          const total = groupCriteria
            .filter((c) => c.enabled)
            .reduce((sum, c) => sum + parseFloat(String(c.peso || "0")), 0);
          if (total !== 100) return false;
        }
      }
      return true;
    });

    if (!isValid) {
      setErrorMessage(
        "Todos os grupos devem ter exatamente 100% de peso nos critérios habilitados." // Updated message
      );
      setShowErrorModal(true);
      return;
    }

    setIsSaving(true);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trilhas));

    try {
      await enviarTrilhasParaBackend(trilhas);
      setShowSuccessModal(true);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Erro ao enviar dados para o backend.";
      setErrorMessage(msg);
      setShowErrorModal(true);
    }

    setIsSaving(false);
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#08605F]">
          Critérios de Avaliação
        </h1>
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
        trilhas={trilhas.map(({ id, name }) => ({ id, nome: name }))}
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
        message={
          errorMessage ||
          "Todos os grupos devem ter exatamente 100% de peso nos critérios habilitados."
        }
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
