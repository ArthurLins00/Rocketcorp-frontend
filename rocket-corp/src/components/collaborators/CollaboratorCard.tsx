import { useNavigate } from "react-router-dom";
import frame from "../../assets/RightChevron.svg";
import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";
import AvatarInicial from "../AvatarInicial";

export const CollaboratorCard: React.FC<
  CollaboratorCardProps & { isRhView?: boolean }
> = ({
  id,
  name,
  role,
  initials,
  status,
  selfRating,
  avaliacao360,
  managerRating,
  notaFinal,
  isRhView = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/gestor/collaborator/${id}`);
  };

  return (
    <div 
      className={`flex flex-col items-start gap-4 p-4 bg-white rounded-xl${
        !isRhView ? ' cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      {...(!isRhView ? { onClick: handleCardClick } : {})}
    >
      <header className="flex h-11 items-center gap-6 w-full">
        <div className="flex items-center gap-4 min-w-0">
          <AvatarInicial nome={name} tamanho={40} />
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
        <div className="inline-flex items-center gap-3 ml-auto">
          <span className="font-medium text-[#1c1c1cbf] text-xs">
            Autoavaliação
          </span>
          <div className="flex w-[37px] items-center justify-center px-2 py-1 bg-[#e6e6e6] rounded">
            <span className="font-bold text-[#1c1c1c] text-sm">
              {selfRating != null ? selfRating.toFixed(1) : "-"}
            </span>
          </div>
          <span className="font-medium text-[#1c1c1cbf] text-xs">
            Nota gestor
          </span>
          <div
            className={`flex w-[37px] items-center justify-center px-2 py-1 ${
              managerRating != null ? "bg-[#08605F]" : "bg-[#e6e6e6]"
            }  rounded`}
          >
            <span
              className={`font-bold ${
                managerRating != null ? "text-[#FFFFFF]" : "text-[#1c1c1c]"
              } text-sm`}
            >
              {managerRating != null ? managerRating.toFixed(1) : "-"}
            </span>
          </div>
          {isRhView && (
            <>
              <span className="font-medium text-[#1c1c1cbf] text-xs">
                Avaliação 360
              </span>
              <div className="flex w-[37px] items-center justify-center px-2 py-1 bg-[#e6e6e6] rounded">
                <span className="font-bold text-[#1c1c1c] text-sm">
                  {avaliacao360 != null ? avaliacao360.toFixed(1) : "-"}
                </span>
              </div>
              <span className="font-medium text-[#1c1c1cbf] text-xs">
                Nota final
              </span>
              <div
                className={`flex w-[37px] items-center justify-center px-2 py-1 ${
                  notaFinal != null ? "bg-[#08605F]" : "bg-[#e6e6e6]"
                }  rounded`}
              >
                <span
                  className={`font-bold ${
                    notaFinal != null ? "text-[#FFFFFF]" : "text-[#1c1c1c]"
                  } text-sm`}
                >
                  {notaFinal != null ? notaFinal.toFixed(1) : "-"}
                </span>
              </div>
            </>
          )}
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
