import { FaUserFriends } from "react-icons/fa";
import { DashboardInfoCard } from "./DashboardInfoCards";

export const CardEqualizacoesPendentes = () => (
  <DashboardInfoCard
    title="Equalizações pendentes"
    subtitle="Conclua suas revisões de nota"
    bgColor="bg-[#08605F]"
    textColor="text-white"
    icon={<FaUserFriends className="text-2xl" />}
  >
    <span className="text-2xl font-bold">10</span>
  </DashboardInfoCard>
);
