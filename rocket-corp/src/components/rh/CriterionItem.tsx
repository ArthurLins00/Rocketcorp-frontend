type Criterion = {
    id: string;
    name: string;
    weight: string;
    description: string;
    required: boolean;
  };
  
  type CriterionItemProps = {
    criterion: Criterion;
    onChange: (updated: Criterion) => void;
  };
  
  export default function CriterionItem({ criterion, onChange }: CriterionItemProps) {
    const handleFieldChange = (field: keyof Criterion, value: string | boolean) => {
      onChange({
        ...criterion,
        [field]: value,
      });
    };
  
    return (
      <div className="border p-4 rounded mb-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            value={criterion.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Nome do critério"
          />
          <input
            type="text"
            className="border px-3 py-2 rounded w-full md:w-32"
            value={criterion.weight}
            onChange={(e) => handleFieldChange("weight", e.target.value)}
            placeholder="Peso"
          />
        </div>
        <textarea
          className="border px-3 py-2 rounded w-full mb-3"
          value={criterion.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Descrição"
          rows={2}
        />
        <label className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            checked={criterion.required}
            onChange={(e) => handleFieldChange("required", e.target.checked)}
            className="mr-2"
          />
          Tornar este critério obrigatório
        </label>
      </div>
    );
  }
  