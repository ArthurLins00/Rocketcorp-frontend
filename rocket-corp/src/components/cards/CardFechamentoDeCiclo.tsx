import { DashboardInfoCard } from "../cards/DashboardInfoCards";
import { FaRegCalendarAlt } from "react-icons/fa";

export const CardFechamentoDeCiclo = () => (
  <DashboardInfoCard
    title="Fechamento de Ciclo"
    bgColor="bg-white"
    textColor="text-black"
  >
    <div className="flex items-center justify-between w-full mt-2">
      {/* Descrição com barra lateral verde */}
      <div className="flex items-start gap-2 flex-1">
        <span className="block w-1 h-10 bg-[#219653] rounded-full mt-1" />
        <span className="text-sm text-[#4F4F4F] leading-tight">
          Faltam 30 dias para o fechamento
          <br />
          do ciclo, no dia 30/08/2025
        </span>
      </div>
      {/* Ícone e número de dias */}
      <div className="flex items-center gap-2 ml-6">
        <FaRegCalendarAlt className="text-[#219653] text-4xl" />
        <div className="flex flex-col items-start">
          <span className="text-4xl font-bold text-[#219653] leading-none">
            30
          </span>
          <span className="text-base font-bold text-[#219653] leading-none">
            dias
          </span>
        </div>
      </div>
    </div>
  </DashboardInfoCard>
);
