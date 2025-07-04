import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type { Criterio } from "../../mocks/trilhasMock";
import { Trash } from "lucide-react";

type CriterionGroupProps = {
  group: {
    groupName: string;
    criteria: Criterio[];
  };
  onCriterionChange: (updated: Criterio, groupName: string) => void;
  onAddCriterion: (groupName: string) => void;
  onRemoveCriterion: (criterionId: string | number, idCiclo: number | string) => void;
};

const CriterionGroupWithRef = forwardRef((props: CriterionGroupProps, ref) => {
  const [localCriteria, setLocalCriteria] = useState(props.group.criteria);
  const [totalWeight, setTotalWeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  

  useEffect(() => {
    console.log("group.criteria atualizado:", props.group.criteria); // <= AQUI
    setLocalCriteria(props.group.criteria);
  }, [props.group.criteria]);

  useEffect(() => {
    const total = localCriteria
      .filter((c) => c.enabled)
      .reduce((sum, c) => sum + parseFloat(String(c.peso || "0")), 0); // Use 'peso' instead of 'weight'
    setTotalWeight(total);
  }, [localCriteria]);

  const handleChange = (
    index: number,
    field: keyof Criterio,
    value: string | boolean
  ) => {
    const updated = [...localCriteria];

    if (field === "peso" && typeof value === "string") {
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setLocalCriteria(updated);
  };

  const getWeightColor = () => {
    if (totalWeight === 100) return "text-green-600";
    if (totalWeight > 100) return "text-red-600";
    return "text-yellow-600";
  };

  useImperativeHandle(ref, () => ({
    getLocalCriteria: () => localCriteria,
  }));

  return (
    <div className="mb-8 p-4 bg-white rounded shadow-sm border border-gray-200">
      {/* Cabeçalho do grupo */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-[#08605F]">
          {props.group.groupName}
        </h3>
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
                {props.group.criteria[index]?.name}
              </h4>

              <div className="flex gap-4 mb-4">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do critério
                  </label>
                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={criterion.peso.toString()} // Use 'peso' instead of 'weight'
                    onChange={
                      (e) => handleChange(index, "peso", e.target.value) // Use 'peso' instead of 'weight'
                    }
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
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    {criterion.enabled ? "Habilitado" : "Desabilitado"}
                  </span>
                  <button
                    onClick={() =>
                      handleChange(index, "enabled", !criterion.enabled)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                      criterion.enabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                    role="switch"
                    aria-checked={criterion.enabled}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        criterion.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => props.onRemoveCriterion(criterion.id, criterion.idCiclo)}
                  className="text-red-600 hover:text-red-800"
                  title="Remover critério"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-2">
            <button
              onClick={() => props.onAddCriterion(props.group.groupName)}
              className="text-sm text-blue-600 hover:underline"
            >
              + Adicionar critério
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default CriterionGroupWithRef;
