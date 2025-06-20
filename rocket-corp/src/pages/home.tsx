import { Sidebar } from "../components/Sidebar";
import { CollaboratorCard } from "../components/CollaboratorCard/CollaboratorCard";
import { MockedCollaboratorCard } from "../components/CollaboratorCard/mockedCollaboratorCard";

export const Home = () => {
  return (
    <div className="home">
      <MockedCollaboratorCard />
    </div>
  );
};
