export interface CollaboratorCardProps {
    name: string;
    role: string;
    initials: string;
    status: string;
    selfRating: number;
    managerRating?: number;
}