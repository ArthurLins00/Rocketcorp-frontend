import React from "react";
import Frame3 from "../assets/Frame (3).svg";
import Frame4 from "../assets/Frame (4).svg";

type CycleStatus =
  | "EM ANDAMENTO"
  | "AGUARDANDO RESULTADO"
  | "RESULTADOS DISPONIVEIS";
interface StatusCycleCardProps {
  bgColor?: string; // cor de fundo
  borderColor?: string; // cor da borda
  textColor?: string; // cor do texto principal
  subTextColor?: string; // cor do texto secundário
  title: string; // texto principal
  subtitle: string; // texto secundário
  iconLeft?: React.ReactNode; // ícone da esquerda
  iconRight?: React.ReactNode; // ícone da direita (seta)
  arrowBorder?: boolean;
  initialStatus?: CycleStatus;
}

export const StatusCycleCard = ({
  bgColor = "bg-[#08605F]",
  borderColor = "border-[#CECDCD]",
  textColor = "text-white",
  subTextColor = "text-white",
  title,
  subtitle,
  iconLeft = <img src={Frame3} alt="Frame" className="w-10 h-10" />,
  iconRight = <img src={Frame4} alt="Frame" className="w-10 h-10" />,
  arrowBorder = false,
}: StatusCycleCardProps) => {
  return (
    <>
      <div
        className={`w-full h-auto min-h-[5rem] ${bgColor} border-2 ${borderColor} rounded-lg`}
      >
        <div className="flex items-center justify-between h-full min-h-[5rem] px-8">
          <div className="flex items-center gap-4">
            {iconLeft}
            <div className="flex flex-col gap-1">
              <span className={`${textColor} text-xl font-bold leading-normal`}>
                {title}
              </span>
              <span className={`${subTextColor} text-sm font-normal`}>
                {subtitle}
              </span>
            </div>
          </div>
          <button
            className={
              arrowBorder ? "bg-[#08605F] rounded-full p-2 bg-white" : ""
            }
          >
            {iconRight}
          </button>
        </div>
      </div>
    </>
  );
};
