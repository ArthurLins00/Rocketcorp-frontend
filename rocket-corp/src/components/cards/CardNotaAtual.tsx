import { FaStar } from "react-icons/fa";
import { DashboardInfoCard } from "../cards/DashboardInfoCards";

export const CardNotaAtual = () => (
  <DashboardInfoCard
    title="Nota atual"
    subtitle="Nota final do ciclo realizado em 2024.2"
    icon={<FaStar className="text-[#219653] text-2xl" />}
    bgColor="bg-white"
    textColor="text-[#219653]"
  >
    <div className="flex flex-col items-end">
      <span className="text-2xl font-bold">4.5</span>
      <span className="text-sm font-bold">Great</span>
    </div>
  </DashboardInfoCard>
);
