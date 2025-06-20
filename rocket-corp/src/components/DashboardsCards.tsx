import { DashboardCard } from "./DashboardCard";
import { FaStar, FaUserFriends } from "react-icons/fa";

export const DashboardsCards = () => (
  <div className="flex flex-col gap-4 md:flex-row md:gap-6 w-full">
    {/* Card 1: Nota atual */}
    <DashboardCard title="Nota atual">
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="text-xs text-[#4F4F4F]">
            Nota final do ciclo realizado em 2024.2
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaStar className="text-[#219653] text-2xl" />
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-[#219653]">4.5</span>
            <span className="text-sm font-bold text-[#219653]">Great</span>
          </div>
        </div>
      </div>
    </DashboardCard>

    {/* Card 2: Preenchimento de avaliação */}
    {/* <DashboardCard title="Preenchimento de avaliação">
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="text-xs text-[#4F4F4F]">
            60% dos seus liderados já fizeram suas avaliações
          </span>
        </div>
        <div className="flex items-center">
          <div className="relative w-14 h-14">
            <svg className="absolute top-0 left-0" width="56" height="56">
              <circle
                cx="28"
                cy="28"
                r="25"
                stroke="#E0E0E0"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="25"
                stroke="#08605F"
                strokeWidth="6"
                fill="none"
                strokeDasharray={2 * Math.PI * 25}
                strokeDashoffset={2 * Math.PI * 25 * 0.4}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[#08605F] font-bold text-lg">
              60%
            </span>
          </div>
        </div>
      </div>
    </DashboardCard> */}

    {/* Card 3: Revisões pendentes */}
    {/* <DashboardCard
      title="Revisões pendentes"
      bgColor="bg-[#08605F]"
      textColor="text-white"
    >
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="text-xs">Conclua suas revisões de nota</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUserFriends className="text-2xl" />
          <span className="text-2xl font-bold">10</span>
        </div>
      </div>
    </DashboardCard> */}
  </div>
);
