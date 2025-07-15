import { FaStar } from "react-icons/fa";
import { DashboardInfoCard } from "./DashboardInfoCards";

export const CardNotaAtual = () => (
  <DashboardInfoCard
    title="Nota atual"
    bgColor="bg-white"
    textColor="text-black"
  >
    <div className="flex items-center justify-between w-full mt-2">
      {/* Descrição com barra lateral verde */}
      <div className="flex items-start gap-2 flex-1">
        <span className="block w-1 h-10 bg-[#219653] rounded-full mt-1" />
        <span className="text-sm text-[#4F4F4F] leading-tight">
          Nota final do ciclo realizado
          <br />
          em <span className="font-bold text-black">2024.2</span>
        </span>
      </div>
      {/* Ícone e nota */}
      <div className="flex items-center gap-2 ml-6">
        <FaStar className="text-[#219653] text-4xl" />
        <div className="flex flex-col items-start">
          <span className="text-4xl font-bold text-[#219653] leading-none">
            4.5
          </span>
          <span className="text-base font-bold text-[#219653] leading-none">
            Great
          </span>
        </div>
      </div>
    </div>
  </DashboardInfoCard>
);
