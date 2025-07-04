import { DashboardInfoCard } from "./DashboardInfoCards";

type Props = {
  porcentagemPreenchimento: number;
};

export const CardPreenchimento = ({ porcentagemPreenchimento }: Props) => (
  <DashboardInfoCard
    title="Preenchimento de avaliação"
    bgColor="bg-white"
    textColor="text-black"
  >
    <div className="flex items-center justify-between w-full mt-2">
      {/* Descrição com barra lateral azul */}
      <div className="flex items-start gap-2 flex-1">
        <span className="block w-1 h-10 bg-[#08605F] rounded-full mt-1" />
        <span className="text-sm text-[#4F4F4F] leading-tight">
          <span className="font-bold text-black">
            {porcentagemPreenchimento}%
          </span>{" "}
          dos seus liderados
          <br />
          já fizeram suas avaliações
        </span>
      </div>
      {/* Ícone e porcentagem */}
      <div className="flex items-center gap-2 ml-6">
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
          <span className="absolute inset-0 flex items-center justify-center text-[#08605F] font-bold text-sm">
            {porcentagemPreenchimento}%
          </span>
        </div>
      </div>
    </div>
  </DashboardInfoCard>
);
