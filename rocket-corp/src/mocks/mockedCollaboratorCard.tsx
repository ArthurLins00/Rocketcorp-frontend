import { CollaboratorCard } from "../components/collaborators/CollaboratorCard";

const collaborators = [
    {
      id: 1,
      name: "Ana Souza",
      role: "Frontend Developer big name role giant like really big",
      initials: "AS",
      status: "Em andamento",
      selfRating: 4.5,
      managerRating: 4.8,
    },
    // ...
  ];
  
  export const MockedCollaboratorCard = () => (
    <div className="grid gap-6">
      {collaborators.map(col => (
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