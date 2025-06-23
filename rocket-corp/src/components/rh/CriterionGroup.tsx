import { useEffect, useState } from "react";

type Criterion = {
  id: string;
  name: string;
  weight: string;
  description: string;
  required: boolean;
};

type CriterionGroupProps = {
  group: {
    groupName: string;
    criteria: Criterion[];
  };
  onCriterionChange: (updated: Criterion, groupName: string) => void;
};

export default function CriterionGroup({ group, onCriterionChange }: CriterionGroupProps) {
  const [localCriteria, setLocalCriteria] = useState<Criterion[]>([]);

  useEffect(() => {
    setLocalCriteria(group.criteria.map((c) => ({ ...c })));
  }, [group.criteria]);

  const handleChange = (index: number, field: keyof Criterion, value: string | boolean) => {
    const updated = [...localCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCriteria(updated);
  };

  const handleBlur = (index: number) => {
    onCriterionChange(localCriteria[index], group.groupName);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-[#08605F] mb-4">{group.groupName}</h3>

      {localCriteria.map((criterion, index) => {
        const original = group.criteria.find((c) => c.id === criterion.id);

        return (
          <div key={criterion.id} className="border rounded-lg p-4 mb-6 shadow-sm bg-gray-50">
            {/* Título fixo baseado na base original */}
            <h4 className="text-md font-bold text-gray-800 mb-3">
              {original?.name || "Critério"}
            </h4>

            {/* Nome + Peso na mesma linha */}
            <div className="flex gap-4 mb-4">
              <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do critério
                </label>
                <input
                  type="text"
                  value={criterion.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  onBlur={() => handleBlur(index)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
                <input
                  type="text"
                  value={criterion.weight}
                  onChange={(e) => handleChange(index, "weight", e.target.value)}
                  onBlur={() => handleBlur(index)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={criterion.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                onBlur={() => handleBlur(index)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>

            {/* Toggle obrigatório */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Campo obrigatório</span>
              <button
                onClick={() => {
                  handleChange(index, "required", !criterion.required);
                  handleBlur(index);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  criterion.required ? "bg-green-500" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={criterion.required}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    criterion.required ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
