import type { Trilha, Criterio } from "../../mocks/trilhasMock";
import CriterionGroup from "./CriterionGroup";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

type TrilhaSectionHandle = {
  getAllLocalCriteria: () => { [groupName: string]: Criterio[] };
};

type TrilhaSectionProps = {
  trilha: Trilha;
  onToggleExpand: (id: number) => void;
  onCriterionChange: (updated: Criterio, groupName: string) => void;
  onAddCriterion: (trilhaId: number, groupName: string) => void;
  refProp?: (instance: TrilhaSectionHandle | null) => void;
  onRemoveCriterion: (groupName: string, criterionId: string | number, idCiclo: number | string ) => void;
};

const TrilhaSection = forwardRef<TrilhaSectionHandle, TrilhaSectionProps>(
  (
    {
      trilha,
      onToggleExpand,
      onCriterionChange,
      onAddCriterion,
      refProp,
      onRemoveCriterion,
    },
    ref
  ) => {
    // refs para cada grupo de critérios
    const groupRefs = useRef<{ [groupName: string]: any }>({});

    // Função para expor os critérios locais de todos os grupos
    const getAllLocalCriteria = () => {
      const result: { [groupName: string]: Criterio[] } = {};
      Object.keys(trilha.criteriosGrouped).forEach((groupName) => {
        const groupRef = groupRefs.current[groupName];
        if (groupRef && groupRef.getLocalCriteria) {
          result[groupName] = groupRef.getLocalCriteria();
        } else {
          result[groupName] = trilha.criteriosGrouped[groupName];
        }
      });
      return result;
    };

    useImperativeHandle(ref, () => ({
      getAllLocalCriteria,
    }));

    // Expor getAllLocalCriteria para o componente pai via refProp, se fornecido
    React.useEffect(() => {
      if (refProp) {
        refProp({ getAllLocalCriteria });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trilha]);

    return (
      <div
        className="border border-gray-300 rounded-md shadow p-4 bg-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#08605F]">{trilha.name}</h2>
          <button
            onClick={() => onToggleExpand(trilha.id)}
            className="text-sm text-[#08605F] hover:underline"
          >
            {trilha.expanded ? "Minimizar trilha" : "Expandir trilha"}
          </button>
        </div>

        {trilha.expanded && (
          <div className="space-y-6">
            {Object.entries(trilha.criteriosGrouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([groupName, criteria]) => (
                <div key={groupName}>
                  <CriterionGroup
                    ref={(el: any) => { groupRefs.current[groupName] = el; }}
                    group={{
                      groupName,
                      criteria: criteria,
                    }}
                    onCriterionChange={(updated, groupName) => {
                      // Convert back to Criterio type
                      const originalCriterio = criteria.find(
                        (c) => c.id === updated.id
                      );
                      const updatedCriterio: Criterio = {
                        id: updated.id,
                        name: updated.name,
                        tipo: originalCriterio?.tipo || "",
                        peso: updated.peso,
                        description: updated.description,
                        idCiclo: originalCriterio?.idCiclo || 1,
                        enabled: updated.enabled,
                        isNew: originalCriterio?.isNew,
                        isModified:
                          typeof updated.id === "number"
                            ? true
                            : originalCriterio?.isModified, // Mark as modified if it's an existing criterio
                      };
                      onCriterionChange(updatedCriterio, groupName);
                    }}
                    onAddCriterion={(groupName) => {
                      onAddCriterion(trilha.id, groupName);
                    }}
                    onRemoveCriterion={(criterionId, idCiclo) => {
                      onRemoveCriterion(groupName, criterionId, idCiclo);
                    }}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
);

export default TrilhaSection;
