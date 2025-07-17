import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";
import AvatarInicial from "../AvatarInicial";

export const SmallerCollaboratorCard: React.FC<CollaboratorCardProps> = ({
  id, // TODO: Use id for navigation when making component clickable
  name,
  role,
  initials,
  status,
}) => {
  return (
    <div className="flex flex-col items-start gap-4 p-4 bg-white rounded-xl">
      <header className="flex h-11 items-center gap-6 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 flex items-center gap-4">
            <AvatarInicial nome={name} tamanho={40} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="font-bold text-sm truncate">{name}</h3>
              <p className="font-normal text-xs text-[#1c1c1cbf] truncate">
                {role}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
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
        </div>
      </header>
    </div>
  );
};
