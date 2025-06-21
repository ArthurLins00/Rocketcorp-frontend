import { DashboardInfoCard } from "../cards/DashboardInfoCards";

export const CardPreenchimento = () => (
  <DashboardInfoCard
    title="Preenchimento de avaliação"
    subtitle="60% dos seus liderados já fizeram suas avaliações"
    bgColor="bg-white"
    textColor="text-[#08605F]"
    icon={
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
    }
  />
);
