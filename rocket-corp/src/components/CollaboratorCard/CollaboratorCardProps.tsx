export interface CollaboratorCardProps {
  name: string;
  role: string;
  initials: string;
  status: string;
  selfRating?: number | null;
  avaliacao360?: number | null;
  managerRating?: number | null;
  notaFinal?: number | null;
}
