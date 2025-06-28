import { useEffect, useRef, useState } from "react";
import TrilhaFilterBar from "../../components/rh/TrilhaFilterBar";
import TrilhaSection from "../../components/rh/TrilhaSection";
import ErrorModal from "../../components/ErrorModal";

import {
  buscarTrilhasDoBackend,
  enviarCriterios,
  salvarCriteriosBulk,
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

    return backendTrilhas
      .map((trilha) => ({
        ...trilha,
        expanded: false,
        // Sort criterios within each group by name
        criteriosGrouped: Object.keys(trilha.criteriosGrouped)
          .sort() // Sort group names alphabetically
          .reduce((acc, groupName) => {
            acc[groupName] = trilha.criteriosGrouped[groupName].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            return acc;
          }, {} as { [key: string]: Criterio[] }),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort trilhas by name
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
            [groupName]: trilha.criteriosGrouped[groupName]
              .map((criterion) =>
                criterion.id === updatedCriterion.id
                  ? { ...updatedCriterion, isModified: true } // Mark as modified
                  : criterion
              )
              .sort((a, b) => a.name.localeCompare(b.name)), // Sort after update
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

        // Get idCiclo from any existing criterio in this trilha
        let idCiclo = 1; // Default fallback
        for (const criterios of Object.values(trilha.criteriosGrouped)) {
          for (const criterio of criterios) {
            if (typeof criterio.id === "number" && criterio.idCiclo) {
              idCiclo = criterio.idCiclo;
              break;
            }
          }
          if (idCiclo !== 1) break; // Found a valid idCiclo, break outer loop
        }

        const newCriterion: Criterio = {
          id: `new-${Date.now()}`, // Use string ID for new criterios
          name: "Novo critério",
          tipo: groupName,
          peso: 0,
          description: "",
          idCiclo, // Use the idCiclo from existing criterios
          enabled: true,
          isNew: true, // Mark as new
        };

        return {
          ...trilha,
          criteriosGrouped: {
            ...trilha.criteriosGrouped,
            [groupName]: [...currentGroupCriteria, newCriterion].sort((a, b) =>
              a.name.localeCompare(b.name)
            ),
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
      // Collect all criterios from all trilhas and groups for update
      const allCriterios: Criterio[] = [];
      trilhas.forEach((trilha) => {
        Object.values(trilha.criteriosGrouped).forEach((criterios) => {
          allCriterios.push(...criterios);
        });
      });

      // Save criterios using the new bulk operations for new criterios
      await salvarCriteriosBulk(trilhas);

      // Update existing criterios using the new enviarCriterios function
      await enviarCriterios(allCriterios);

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
