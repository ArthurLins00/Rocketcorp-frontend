import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAllCards,
  searchCards,
} from "../../controllers/collaboratorsListController";
import { CollaboratorsListSearchbar } from "../../components/collaborators/CollaboratorsListSearchbar";
import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";
import { CollaboratorCardSmaller } from "./CollaboratorCardSmaller";

export const DashboardSmallerCollaboratorCard = () => {
  const [cards, setCards] = useState<CollaboratorCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isRhView = location.pathname.includes("rh");

  useEffect(() => {
    getAllCards(isRhView).then((data) => {
      setCards(data);
      setLoading(false);
    });
  }, [isRhView]);

  const handleSearch = (q: string) => {
    setLoading(true);
    searchCards(q, isRhView).then((data) => {
      setCards(data);
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col w-1/2 h-full pt-4 px-5">
      <CollaboratorsListSearchbar onSearch={handleSearch} />
      {loading ? (
        <p className="px-5 py-4">Carregando...</p>
      ) : (
        <div
          className="flex flex-col gap-2 mt-4 overflow-y-auto"
          style={{
            maxHeight: "400px", // Altura para mostrar 5 cards como na imagem
            paddingRight: "4px", // espaço para scrollbar sem sobrepor conteúdo
          }}
        >
          {cards.map((c) => (
            <CollaboratorCardSmaller key={c.id} {...c} isRhView={isRhView} />
          ))}
        </div>
      )}
    </div>
  );
};
