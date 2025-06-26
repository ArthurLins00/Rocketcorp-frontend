import { CollaboratorCard } from "../../models/CollaboratorCard";
import { collaborators } from "../../mocks/mockedCollaboratorCard";

export const DashboardCollaboratorCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm w-full">
    <div className="flex justify-between items-center mb-4">
      <span className="font-bold text-lg">Colaboradores</span>
      <a
        href="#"
        className="text-[#219653] font-semibold text-sm hover:underline"
      >
        Ver mais
      </a>
    </div>
    <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
      {collaborators.map((item) => (
        <CollaboratorCard
          key={item.id}
          name={item.name}
          role={item.role}
          initials={item.initials}
          status={item.status}
          selfRating={item.selfRating}
          avaliacao360={item.avaliacao360}
          managerRating={item.managerRating}
          notaFinal={item.notaFinal}
        />
      ))}
    </div>
  </div>
);
