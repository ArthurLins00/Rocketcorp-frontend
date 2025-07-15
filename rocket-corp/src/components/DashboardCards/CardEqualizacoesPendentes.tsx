import { FaUserFriends } from "react-icons/fa";
import { DashboardInfoCard } from "./DashboardInfoCards";

export const CardEqualizacoesPendentes = () => (
  <DashboardInfoCard
    title="Equalizações pendentes"
    bgColor="bg-[#08605F]"
    textColor="text-white"
  >
    <div className="flex items-center justify-between w-full mt-2">
      {/* Descrição com barra lateral branca */}
      <div className="flex items-start gap-2 flex-1">
        <span className="block w-1 h-10 bg-white rounded-full mt-1" />
        <span className="text-sm text-white leading-tight">
          Conclua suas <span className="font-bold">equalizações</span>
          <br />
          de nota pendentes
        </span>
      </div>
      {/* Ícone e número */}
      <div className="flex items-center gap-2 ml-6">
        <FaUserFriends className="text-white text-4xl" />
        <span className="text-4xl font-bold text-white leading-none">10</span>
      </div>
    </div>
  </DashboardInfoCard>
);
