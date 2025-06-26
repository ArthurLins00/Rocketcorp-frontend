import { CollaboratorCard } from "../components/collaborators/CollaboratorCard";

export const collaborators = [
  {
    id: 1,
    name: "Colaborador 1",
    role: "Product Design",
    initials: "CN",
    status: "Em andamento",
    selfRating: 4.0,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: 2,
    name: "Colaborador 1",
    role: "Product Design",
    initials: "CN",
    status: "Em andamento",
    selfRating: 4.0,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: 3,
    name: "Colaborador 1",
    role: "Product Design",
    initials: "CN",
    status: "Em andamento",
    selfRating: 4.0,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: 4,
    name: "Colaborador 1",
    role: "Product Design",
    initials: "CN",
    status: "Finalizado",
    selfRating: 4.0,
    managerRating: 4.5,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: 5,
    name: "Colaborador 1",
    role: "Product Design",
    initials: "CN",
    status: "Finalizado",
    selfRating: 4.0,
    managerRating: 4.5,
    avaliacao360: null,
    notaFinal: null,
  },
];

export const MockedCollaboratorCard = () => (
  <div className="grid gap-6">
    {collaborators.map((col) => (
      <CollaboratorCard
        key={col.id}
        name={col.name}
        role={col.role}
        initials={col.initials}
        status={col.status}
        selfRating={col.selfRating}
        managerRating={col.managerRating}
      />
    ))}
  </div>
);
