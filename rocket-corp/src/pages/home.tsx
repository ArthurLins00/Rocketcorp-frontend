import { Sidebar } from "../components/Sidebar";
import { CollaboratorCard } from "../components/collaborators/CollaboratorCard";
import { MockedCollaboratorCard } from "../mocks/mockedCollaboratorCard";

export const Home = () => {
  return (
    <div className="home">
      <MockedCollaboratorCard />
    </div>
  );
};
