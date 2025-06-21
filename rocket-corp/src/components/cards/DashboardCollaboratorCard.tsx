import { CollaboratorCard } from "../CollaboratorCard/CollaboratorCard";

const collaborators = [
  {
    id: 1,
    name: "Ana Souza",
    role: "Frontend Developer",
    initials: "AS",
    status: "Em andamento",
    selfRating: 4.5,
    managerRating: 4.8,
  },
  {
    id: 2,
    name: "Bruno Lima",
    role: "Backend Engineer",
    initials: "BL",
    status: "Finalizado",
    selfRating: 4.2,
    managerRating: 4.4,
  },
  {
    id: 3,
    name: "Carla Martins",
    role: "Product Manager",
    initials: "CM",
    status: "Pendente",
    selfRating: null,
    managerRating: null,
  },
  {
    id: 4,
    name: "Daniel Ferreira",
    role: "UI Designer",
    initials: "DF",
    status: "Finalizado",
    selfRating: 4.9,
    managerRating: 4.7,
  },
  {
    id: 5,
    name: "Elisa Gomes",
    role: "Data Analyst",
    initials: "EG",
    status: "Pendente",
    selfRating: null,
    managerRating: null,
  },
  {
    id: 6,
    name: "Felipe Andrade",
    role: "DevOps Specialist",
    initials: "FA",
    status: "Finalizado",
    selfRating: 4.6,
    managerRating: 4.8,
  },
];
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
          managerRating={item.managerRating}
        />
      ))}
    </div>
  </div>
);
