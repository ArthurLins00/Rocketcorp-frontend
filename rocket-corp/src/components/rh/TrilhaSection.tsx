import CriterionGroup from "./CriterionGroup";
import type { Criterion } from "../../mocks/criteriosBase";

type CriterionGroup = {
  groupName: string;
  criteria: Criterion[];
};

type TrilhaSectionProps = {
  trilha: {
    id: string;
    nome: string;
    expanded?: boolean;
    criteriaGroups: CriterionGroup[];
  };
  onToggleExpand: (id: string) => void;
  onCriterionChange: (updated: Criterion, groupName: string) => void;
  onAddCriterion: (trilhaId: string, groupName: string) => void;
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
    <div ref={refProp} className="border border-gray-300 rounded-md shadow p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#08605F]">{trilha.nome}</h2>
        <button
          onClick={() => onToggleExpand(trilha.id)}
          className="text-sm text-[#08605F] hover:underline"
        >
          {trilha.expanded ? "Minimizar trilha" : "Expandir trilha"}
        </button>
      </div>

      {trilha.expanded && (
        <div className="space-y-6">
          {trilha.criteriaGroups.map((group) => (
            <div key={group.groupName}>
              <CriterionGroup
                group={group}
                onCriterionChange={(updated, groupName) => onCriterionChange(updated, groupName)}
              />
              <div className="text-right mt-2">
              <button
                onClick={() => {
                  console.log("Adicionar critério clicado:", trilha.id, group.groupName);
                  onAddCriterion(trilha.id, group.groupName);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                + Adicionar critério
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
