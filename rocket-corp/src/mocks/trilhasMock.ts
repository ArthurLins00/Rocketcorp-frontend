export type Trilha = {
  id: number;
  name: string;
  expanded?: boolean; // Optional since backend doesn't have this field
  criteriosGrouped: {
    [key: string]: Criterio[];
  };
};

export type Criterio = {
  id: number;
  name: string;
  tipo: string; // Match backend property name
  peso: number; // Match backend property name
  description: string;
  enabled: boolean;
};
