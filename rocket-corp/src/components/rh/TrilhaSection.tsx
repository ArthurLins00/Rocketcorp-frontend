import type { Trilha, Criterio } from "../../mocks/trilhasMock";
import CriterionGroup from "./CriterionGroup";

type TrilhaSectionProps = {
  trilha: Trilha;
  onToggleExpand: (id: number) => void;
  onCriterionChange: (updated: Criterio, groupName: string) => void;
  onAddCriterion: (trilhaId: number, groupName: string) => void;
  refProp?: (el: HTMLDivElement | null) => void;
};

export default function TrilhaSection({
  trilha,
  onToggleExpand,
  onCriterionChange,
  onAddCriterion,
  refProp,
}: TrilhaSectionProps) {
  return (
    <div
      ref={refProp}
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
          {Object.entries(trilha.criteriosGrouped).map(
            ([groupName, criteria]) => (
              <div key={groupName}>
                <CriterionGroup
                  group={{
                    groupName,
                    criteria: criteria, // Now the data is already transformed in CriteriaManagementPage
                  }}
                  onCriterionChange={(updated, groupName) => {
                    // Convert back to Criterio type
                    const updatedCriterio: Criterio = {
                      id: updated.id,
                      name: updated.name,
                      tipo:
                        criteria.find((c) => c.id === updated.id)?.tipo || "",
                      peso: updated.peso, // Use 'peso' instead of 'weight'
                      description: updated.description,
                      enabled: updated.enabled,
                    };
                    onCriterionChange(updatedCriterio, groupName);
                  }}
                />
                <div className="text-right mt-2">
                  <button
                    onClick={() => {
                      console.log(
                        "Adicionar critério clicado:",
                        trilha.id,
                        groupName
                      );
                      onAddCriterion(trilha.id, groupName);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Adicionar critério
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
