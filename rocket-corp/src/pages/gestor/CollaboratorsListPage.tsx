import { useEffect, useState } from "react";
import { getAllCards, searchCards } from '../../controllers/collaboratorsCardController';
import { CollaboratorsHeader } from "../../components/collaborators/CollaboratorsListHeader";
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
        <>
        <div className="flex flex-col">
            <CollaboratorsHeader />
            <div className="flex flex-col w-full h-full pt-7">
                <CollaboratorsListSearchbar onSearch={handleSearch} />
            </div>
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="grid gap-4 mt-4">
                    {cards.map(c => (
                        <CollaboratorCard key={c.initials + c.name} {...c} />
                    ))}
                </div>
            )}
        </div>
        </>
    )   
}


