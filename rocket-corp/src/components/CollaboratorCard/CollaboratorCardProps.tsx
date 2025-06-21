export interface CollaboratorCardProps {
  name: string;
  role: string;
  initials: string;
  status: string;
  selfRating?: number | null;
  managerRating?: number | null;
}
