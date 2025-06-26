import CriterionGroup from "./CriterionGroup";

type Criterion = {
  id: string;
  name: string;
  weight: string;
  description: string;
  required: boolean;
};

type CriterionGroup = {
  groupName: string;
  criteria: Criterion[];
};

type Trilha = {
  id: string;
  nome: string;
  expanded: boolean;
  criteriaGroups: CriterionGroup[];
};

type TrilhaSectionProps = {
  trilha: Trilha;
  onToggleExpand: (id: string) => void;
  onCriterionChange: (updatedCriterion: Criterion, groupName: string) => void;
  refProp?: React.Ref<HTMLDivElement>;
};

export default function TrilhaSection({
  trilha,
  onToggleExpand,
  onCriterionChange,
  refProp,
}: TrilhaSectionProps) {
    const handleCriterionChange = (updatedCriterion: Criterion, groupName: string) => {
        onCriterionChange(updatedCriterion, groupName);
      };

  return (
    <div ref={refProp} className="border rounded p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{trilha.nome}</h2>
        <button
          onClick={() => onToggleExpand(trilha.id)}
          className="text-[#08605F] text-sm font-medium hover:underline"
        >
          {trilha.expanded ? "Minimizar" : "Expandir"}
        </button>
      </div>

        {trilha.expanded &&
        trilha.criteriaGroups.map((group) => (
            <CriterionGroup
            key={group.groupName}
            group={group}
            onCriterionChange={(updated, groupName) =>
                handleCriterionChange(updated, groupName)
            }
            />
        ))}
    </div>
  );
}
