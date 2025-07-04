import { useState } from "react";
import AutoAvaliacaoForm from "../components/AutoavaliacaoForm";
import Avaliacao360Form from "../components/Avaliacao360Form";
import MentoringForm from "../components/MentoringForm";
import ReferenciasForm from "../components/ReferenciasForm";

const CycleEvaluation = () => {
  const [activeTab, setActiveTab] = useState("autoavaliacao");

  const tabs = [
    {
      id: "autoavaliacao",
      label: "Autoavaliação",
      component: <AutoAvaliacaoForm />,
    },
    {
      id: "avaliacao360",
      label: "Avaliação 360°",
      component: <Avaliacao360Form />,
    },
    { id: "mentoring", label: "Mentoring", component: <MentoringForm /> },
    { id: "referencias", label: "Referências", component: <ReferenciasForm /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Avaliação de Ciclo
          </h1>
          <p className="text-gray-600 mt-2">
            Complete todos os formulários para finalizar sua avaliação
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#08605F] text-[#08605F]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </main>
    </div>
  );
};

export default CycleEvaluation;
