import { CollaboratorCard } from "../components/collaborators/CollaboratorCard";

export const collaborators = [
  {
    id: "1",
    name: "Ana Silva",
    role: "Product Designer",
    initials: "AS",
    status: "Em andamento",
    selfRating: 4.0,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    role: "Frontend Developer",
    initials: "CO",
    status: "Em andamento",
    selfRating: 3.8,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: "3",
    name: "Maria Santos",
    role: "UX Designer",
    initials: "MS",
    status: "Em andamento",
    selfRating: 4.2,
    managerRating: null,
    avaliacao360: null,
    notaFinal: null,
  },
  {
    id: "4",
    name: "João Pereira",
    role: "Backend Developer",
    initials: "JP",
    status: "Finalizado",
    selfRating: 4.0,
    managerRating: 4.5,
    avaliacao360: 4.1,
    notaFinal: 4.2,
  },
  {
    id: "5",
    name: "Laura Costa",
    role: "Product Manager",
    initials: "LC",
    status: "Finalizado",
    selfRating: 3.9,
    managerRating: 4.3,
    avaliacao360: 4.0,
    notaFinal: 4.1,
  },
];

export const MockedCollaboratorCard = () => (
  <div className="grid gap-6">
    {collaborators.map((col) => (
      <CollaboratorCard
        key={col.id}
        id={col.id}
        name={col.name}
        role={col.role}
        initials={col.initials}
        status={col.status}
        selfRating={col.selfRating}
        managerRating={col.managerRating}
        avaliacao360={col.avaliacao360}
        notaFinal={col.notaFinal}
      />
    ))}
  </div>
);
