import { useEffect, useState } from "react";
import type { Criterion } from "../../mocks/criteriosBase";

type CriterionGroupProps = {
  group: {
    groupName: string;
    criteria: Criterion[];
  };
  onCriterionChange: (updated: Criterion, groupName: string) => void;
};

export default function CriterionGroup({ group, onCriterionChange }: CriterionGroupProps) {
  const [localCriteria, setLocalCriteria] = useState(group.criteria);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    console.log("group.criteria atualizado:", group.criteria); // <= AQUI
    setLocalCriteria(group.criteria);
  }, [group.criteria]);

  useEffect(() => {
    const total = localCriteria
      .filter((c) => c.required)
      .reduce((sum, c) => sum + parseFloat(c.weight || "0"), 0);
    setTotalWeight(total);
  }, [localCriteria]);

  const handleChange = (index: number, field: keyof Criterion, value: string | boolean) => {
    const updated = [...localCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCriteria(updated);
    onCriterionChange(updated[index], group.groupName);
  };

  const getWeightColor = () => {
    if (totalWeight === 100) return "text-green-600";
    if (totalWeight > 100) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="mb-8 p-4 bg-white rounded shadow-sm border border-gray-200">
      {/* Cabeçalho do grupo */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-[#08605F]">{group.groupName}</h3>
        <div className="flex flex-col items-end">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-[#08605F] hover:underline"
          >
            {isExpanded ? "Minimizar grupo" : "Expandir grupo"}
          </button>
          <span className={`text-sm font-semibold ${getWeightColor()} mt-1`}>
            Total: {totalWeight.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Critérios */}
      {isExpanded && (
        <>
          {localCriteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className="border rounded-lg p-4 mb-6 shadow-sm bg-gray-50"
            >
              <h4 className="text-md font-bold text-gray-800 mb-3">
                {localCriteria[index]?.name}
              </h4>

              <div className="flex gap-4 mb-4">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do critério
                  </label>
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (%)
                  </label>
                  <input
                    type="text"
                    value={criterion.weight}
                    onChange={(e) => handleChange(index, "weight", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={criterion.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {criterion.required ? "Habilitado" : "Desabilitado"}
                </span>
                <button
                  onClick={() =>
                    handleChange(index, "required", !criterion.required)
                  }
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
          ))}
        </>
      )}
    </div>
  );
}
