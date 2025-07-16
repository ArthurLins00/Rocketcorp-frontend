import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAllCards,
  searchCards,
} from "../../controllers/collaboratorsListController";
import { CollaboratorsListSearchbar } from "../../components/collaborators/CollaboratorsListSearchbar";
import { CollaboratorCard } from "../../components/collaborators/CollaboratorCard";
import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";

export const CollaboratorsListPage = () => {
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
    <div className="flex flex-col">
      <div className="flex flex-col w-full h-full pt-7 px-5">
        <CollaboratorsListSearchbar onSearch={handleSearch} />
      </div>
      {loading ? (
        <p className="px-5 py-4">Carregando...</p>
      ) : (
        <div
          className="grid gap-4 mt-4 px-5 overflow-y-auto"
          style={{ maxHeight: "70vh" }}
        >
          {cards.map((c) => (
            <CollaboratorCard key={c.id} {...c} isRhView={isRhView} />
          ))}
        </div>
      )}
    </div>
  );
};
