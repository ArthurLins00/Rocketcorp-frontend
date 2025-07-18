import { DashboardInfoCard } from "./DashboardInfoCards";
import { FaRegEdit } from "react-icons/fa";

export const CardAvaliacoesPendentes = () => (
  <DashboardInfoCard
    title="Avaliações pendentes"
    bgColor="bg-white"
    textColor="text-black"
  >
    <div className="flex items-center justify-between w-full mt-2">
      {/* Descrição com barra lateral vermelha */}
      <div className="flex items-start gap-2 flex-1">
        <span className="block w-1 h-10 bg-[#EB5757] rounded-full mt-1" />
        <span className="text-sm text-[#4F4F4F] leading-tight">
          <span className="font-bold text-black">30 colaboradores</span> ainda
          não
          <br />
          fecharam sua avaliação
        </span>
      </div>
      {/* Ícone e número de avaliações */}
      <div className="flex items-center gap-2 ml-6">
        <FaRegEdit className="text-[#EB5757] text-4xl" />
        <span className="text-4xl font-bold text-[#EB5757] leading-none">
          30
        </span>
      </div>
    </div>
  </DashboardInfoCard>
);
