import { useNavigate } from "react-router-dom";
import frame from "../../assets/RightChevron.svg";
import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";

export const CollaboratorCardSmaller: React.FC<
  CollaboratorCardProps & { isRhView?: boolean }
> = ({
  id,
  name,
  role,
  initials,
  status,

  isRhView = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/gestor/colaborador/${id}`);
  };

  return (
    <div
      className={`flex flex-col items-start gap-4 p-4 bg-white rounded-xl${
        !isRhView ? " cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      {...(!isRhView ? { onClick: handleCardClick } : {})}
    >
      <header className="flex h-11 items-center gap-6 w-full">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
            <span className="text-slate-900 font-bold">{initials}</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="font-bold text-sm truncate">{name}</h3>
            <p className="font-normal text-xs text-[#1c1c1cbf] truncate">
              {role}
            </p>
          </div>
          <div
            className={`inline-flex items-center justify-center gap-2.5 px-2 py-1 rounded-[5px] flex-shrink-0 ${
              status === "Finalizado" ? "bg-[#BEE7CF]" : "bg-[#fdeb6580]"
            } ml-2`}
          >
            <span
              className={`font-bold text-[10px] ${
                status === "Finalizado" ? "text-[#419958]" : "text-[#f5a930]"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="w-6 h-6 flex-shrink-0">
          <img
            className="w-[13px] h-[13px] m-auto"
            alt="Frame icon"
            src={frame}
          />
        </div>
      </header>
    </div>
  );
};
