import type { Criterio } from "./Criterio";
import type { User } from "./User";

export type Trilha = {
  id: number;
  name: string;
  users?: User[];
  criterio?: Criterio[];
  createdAt: string;
  updatedAt: string;
};
