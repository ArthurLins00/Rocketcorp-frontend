import { useEffect, useRef, useState } from "react";
import TrilhaFilterBar from "../../components/rh/TrilhaFilterBar";
import TrilhaSection from "../../components/rh/TrilhaSection";
import ErrorModal from "../../components/ErrorModal";

import {
  buscarTrilhasDoBackend,
  enviarCriterios,
  salvarCriteriosBulk,
  removerCriterio,
} from "../../services/trilhaService";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";
import type { Trilha, Criterio } from "../../mocks/trilhasMock";
import { useCriteriaSave } from "../../contexts/CriteriaSaveContext";

const LOCAL_STORAGE_KEY = "rocketCorp.trilhas";

export default function CriteriaManagementPage() {
  // State now directly uses the new Trilha type
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const trilhaRefs = useRef<{ [key: number]: any }>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Use the global context to register the save function
  const { registerSaveFunction, unregisterSaveFunction } = useCriteriaSave();
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
            [groupName]: trilha.criteriosGrouped[groupName].map((criterion) =>
              criterion.id === updatedCriterion.id
                ? { ...updatedCriterion, isModified: true } // Mark as modified
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

  // Register the save function in the global context when component mounts
  useEffect(() => {
    console.log(
      "🔧 [CriteriaManagementPage] Registering save function in global context"
    );

    // Define handleSaveClick inside useEffect to avoid dependency issues
    const localHandleSaveClick = async () => {
      console.log(
        "🔘 [CriteriaManagementPage] handleSaveClick called via context"
      );
      console.log("🚀 [CriteriaManagementPage] Starting save process...");

      // Consolidate local edits - defined inside useEffect to avoid dependencies
      const consolidateTrilhas = () => {
        return trilhas.map((trilha) => {
          const trilhaRef = trilhaRefs.current[trilha.id];
          if (trilhaRef && trilhaRef.getAllLocalCriteria) {
            const localGroups = trilhaRef.getAllLocalCriteria();
            // Marcar isModified se houver diferença
            const criteriosGroupedMarcados: { [key: string]: Criterio[] } = {};
            Object.entries(localGroups).forEach(
              ([groupName, localCriterios]) => {
                criteriosGroupedMarcados[groupName] = (
                  localCriterios as Criterio[]
                ).map((localCriterio: Criterio) => {
                  // Procurar o critério original global
                  const original = trilha.criteriosGrouped[groupName]?.find(
                    (c) => c.id === localCriterio.id
                  );
                  if (!original) return localCriterio; // Novo critério
                  // Verificar se houve alteração
                  const alterado =
                    localCriterio.name !== original.name ||
                    localCriterio.peso !== original.peso ||
                    localCriterio.description !== original.description ||
                    localCriterio.enabled !== original.enabled;
                  if (alterado) {
                    return { ...localCriterio, isModified: true };
                  }
                  return { ...localCriterio, isModified: original.isModified };
                });
              }
            );
            return {
              ...trilha,
              criteriosGrouped: criteriosGroupedMarcados,
            };
          }
          return trilha;
        });
      };

      // Consolidar edições locais em uma variável temporária
      const trilhasConsolidadas = consolidateTrilhas();

      // Verificação: campos obrigatórios (nome e descrição)
      const hasEmptyFields = trilhasConsolidadas.some((trilha) =>
        Object.values(trilha.criteriosGrouped).some((criterios) =>
          (criterios as Criterio[]).some(
            (c: Criterio) => !c.name.trim() || !c.description.trim()
          )
        )
      );

      if (hasEmptyFields) {
        console.warn(
          "⚠️ [CriteriaManagementPage] Empty fields validation failed"
        );
        setErrorMessage(
          "Todos os critérios devem ter Nome e Descrição preenchidos."
        );
        setShowErrorModal(true);
        return;
      }

      // Validação dos pesos
      const isValid = trilhasConsolidadas.every((trilha) => {
        for (const groupName in trilha.criteriosGrouped) {
          if (
            Object.prototype.hasOwnProperty.call(
              trilha.criteriosGrouped,
              groupName
            )
          ) {
            const groupCriteria = trilha.criteriosGrouped[
              groupName
            ] as Criterio[];
            const total = groupCriteria
              .filter((c: Criterio) => c.enabled)
              .reduce(
                (sum: number, c: Criterio) =>
                  sum + parseFloat(String(c.peso || "0")),
                0
              );
            if (total !== 100) return false;
          }
        }
        return true;
      });

      if (!isValid) {
        console.warn("⚠️ [CriteriaManagementPage] Weight validation failed");
        setErrorMessage(
          "Todos os grupos devem ter exatamente 100% de peso nos critérios habilitados."
        );
        setShowErrorModal(true);
        return;
      }

      console.log(
        "✅ [CriteriaManagementPage] All validations passed, proceeding with save..."
      );
      setIsSaving(true);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(trilhasConsolidadas)
      );

      try {
        // Agrupa todos os critérios para envio
        const allCriterios: Criterio[] = [];
        trilhasConsolidadas.forEach((trilha) => {
          Object.values(trilha.criteriosGrouped).forEach((criterios) => {
            allCriterios.push(...(criterios as Criterio[]));
          });
        });

        console.log(
          "📤 [CriteriaManagementPage] Sending criteria to backend..."
        );

        // Primeiro envia os novos critérios (bulk)
        await salvarCriteriosBulk(trilhasConsolidadas);
        console.log("✅ [CriteriaManagementPage] Bulk save completed");

        // Depois envia os existentes atualizados
        await enviarCriterios(allCriterios);
        console.log(
          "✅ [CriteriaManagementPage] Individual criteria update completed"
        );

        setShowSuccessModal(true);
        setTrilhas(trilhasConsolidadas); // Atualiza o estado global só depois do sucesso
        console.log(
          "🎉 [CriteriaManagementPage] Save process completed successfully!"
        );
      } catch (error) {
        console.error("❌ [CriteriaManagementPage] Save failed:", error);
        const msg =
          error instanceof Error
            ? error.message
            : "Erro ao enviar dados para o backend.";
        setErrorMessage(msg);
        setShowErrorModal(true);
      }

      setIsSaving(false);
    };

    registerSaveFunction(localHandleSaveClick);

    // Cleanup: unregister when component unmounts
    return () => {
      console.log(
        "🧹 [CriteriaManagementPage] Unregistering save function from global context"
      );
      unregisterSaveFunction();
    };
  }, [trilhas, registerSaveFunction, unregisterSaveFunction]);

  // Novo: consolidar dados locais antes de salvar, marcando isModified quando necessário
  const getTrilhasWithLocalEdits = () => {
    return trilhas.map((trilha) => {
      const trilhaRef = trilhaRefs.current[trilha.id];
      if (trilhaRef && trilhaRef.getAllLocalCriteria) {
        const localGroups = trilhaRef.getAllLocalCriteria();
        // Marcar isModified se houver diferença
        const criteriosGroupedMarcados: { [key: string]: Criterio[] } = {};
        Object.entries(localGroups).forEach(([groupName, localCriterios]) => {
          criteriosGroupedMarcados[groupName] = (
            localCriterios as Criterio[]
          ).map((localCriterio: Criterio) => {
            // Procurar o critério original global
            const original = trilha.criteriosGrouped[groupName]?.find(
              (c) => c.id === localCriterio.id
            );
            if (!original) return localCriterio; // Novo critério
            // Verificar se houve alteração
            const alterado =
              localCriterio.name !== original.name ||
              localCriterio.peso !== original.peso ||
              localCriterio.description !== original.description ||
              localCriterio.enabled !== original.enabled;
            if (alterado) {
              return { ...localCriterio, isModified: true };
            }
            return { ...localCriterio, isModified: original.isModified };
          });
        });
        return {
          ...trilha,
          criteriosGrouped: criteriosGroupedMarcados,
        };
      }
      return trilha;
    });
  };

  const confirmSave = async () => {
    setShowConfirmModal(false);

    // Consolidar edições locais em uma variável temporária
    const trilhasConsolidadas = getTrilhasWithLocalEdits();

    // Verificação: campos obrigatórios (nome e descrição)
    const hasEmptyFields = trilhasConsolidadas.some((trilha) =>
      Object.values(trilha.criteriosGrouped).some((criterios) =>
        (criterios as Criterio[]).some(
          (c: Criterio) => !c.name.trim() || !c.description.trim()
        )
      )
    );

    if (hasEmptyFields) {
      setErrorMessage(
        "Todos os critérios devem ter Nome e Descrição preenchidos."
      );
      setShowErrorModal(true);
      return;
    }

    // Validação dos pesos
    const isValid = trilhasConsolidadas.every((trilha) => {
      for (const groupName in trilha.criteriosGrouped) {
        if (
          Object.prototype.hasOwnProperty.call(
            trilha.criteriosGrouped,
            groupName
          )
        ) {
          const groupCriteria = trilha.criteriosGrouped[
            groupName
          ] as Criterio[];
          const total = groupCriteria
            .filter((c: Criterio) => c.enabled)
            .reduce(
              (sum: number, c: Criterio) =>
                sum + parseFloat(String(c.peso || "0")),
              0
            );
          if (total !== 100) return false;
        }
      }
      return true;
    });

    if (!isValid) {
      setErrorMessage(
        "Todos os grupos devem ter exatamente 100% de peso nos critérios habilitados."
      );
      setShowErrorModal(true);
      return;
    }

    setIsSaving(true);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(trilhasConsolidadas)
    );

    try {
      // Agrupa todos os critérios para envio
      const allCriterios: Criterio[] = [];
      trilhasConsolidadas.forEach((trilha) => {
        Object.values(trilha.criteriosGrouped).forEach((criterios) => {
          allCriterios.push(...(criterios as Criterio[]));
        });
      });

      // Primeiro envia os novos critérios (bulk)
      await salvarCriteriosBulk(trilhasConsolidadas);

      // Depois envia os existentes atualizados
      await enviarCriterios(allCriterios);

      setShowSuccessModal(true);
      setTrilhas(trilhasConsolidadas); // Atualiza o estado global só depois do sucesso
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

  const handleRemoveCriterion = async (
    trilhaId: number,
    groupName: string,
    criterionId: string | number,
    idCiclo: number | string
  ) => {
    // Se for critério já salvo no backend, remover no backend primeiro
    if (typeof criterionId === "number") {
      try {
        await removerCriterio(criterionId);
      } catch (error) {
        setErrorMessage("Erro ao remover critério no backend.");
        setShowErrorModal(true);
        return;
      }
    }
    // Remover do estado local
    setTrilhas((prevTrilhas) =>
      prevTrilhas.map((trilha) => {
        if (trilha.id !== trilhaId) return trilha;
        const updatedGroup = trilha.criteriosGrouped[groupName]?.filter(
          (criterio) =>
            !(criterio.id === criterionId && criterio.idCiclo === idCiclo)
        );
        return {
          ...trilha,
          criteriosGrouped: {
            ...trilha.criteriosGrouped,
            [groupName]: updatedGroup,
          },
        };
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
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
            onRemoveCriterion={(groupName, criterionId, idCiclo) =>
              handleRemoveCriterion(trilha.id, groupName, criterionId, idCiclo)
            }
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
