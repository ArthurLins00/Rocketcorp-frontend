import { useEffect, useState } from "react";
import { getAllCards, searchCards } from '../../controllers/collaboratorsCardController';
import { CollaboratorsListSearchbar } from "../../components/collaborators/CollaboratorsListSearchbar";
import { CollaboratorCard } from '../../components/collaborators/CollaboratorCard';
import type { CollaboratorCardProps } from "../../models/CollaboratorCardProps";

export const CollaboratorsPage = () => {
    const [cards, setCards] = useState<CollaboratorCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCards().then(data => {
            setCards(data);
            setLoading(false);
        });
    }, []);

    const handleSearch = (q: string) => {
        setLoading(true);
        searchCards(q).then(data => {
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
                <div className="grid gap-4 mt-4 px-5">
                    {cards.map(c => (
                        <CollaboratorCard key={c.id} {...c} />
                    ))}
                </div>
            )}
        </div>
    )   
}


