import Frame3 from "../assets/Frame (3).svg";
import Frame4 from "../assets/Frame (4).svg";

interface StatusCycleCardProps {
  bgColor?: string; // cor de fundo
  borderColor?: string; // cor da borda
  textColor?: string; // cor do texto principal
  subTextColor?: string; // cor do texto secundário
  title: string; // texto principal
  subtitle: string; // texto secundário
  iconLeft?: string; // ícone da esquerda
  iconRight?: string; // ícone da direita (seta)
  arrowBorder?: boolean;
}

export const StatusCycleCard = ({
  bgColor = "bg-[#08605F]",
  borderColor = "border-[#CECDCD]",
  textColor = "text-white",
  subTextColor = "text-white",
  title,
  subtitle,
  iconLeft = Frame3,
  iconRight = Frame4,
  arrowBorder = false,
}: StatusCycleCardProps) => {
  return (
    <div
      className={`w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-auto min-h-[5rem] ${bgColor} border-2 ${borderColor} rounded-lg`}
    >
      <div className="flex items-center justify-between h-full min-h-[5rem] px-8">
        <div className="flex items-center gap-4">
          <img src={iconLeft} alt="Frame" className="w-10 h-10" />
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
          <img src={iconRight} alt="Frame" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};
