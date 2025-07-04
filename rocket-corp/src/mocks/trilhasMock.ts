export type Trilha = {
  id: number;
  name: string;
  expanded?: boolean;
  criteriosGrouped: {
    [key: string]: Criterio[];
  };
};

export type Criterio = {
  id: number | string; // Allow string for new criterios (temporary IDs)
  name: string;
  tipo: string;
  peso: number;
  description: string;
  idCiclo: number;
  enabled: boolean;
  isNew?: boolean; // Flag to identify new criterios
  isModified?: boolean; // Flag to identify modified criterios
};

// Types for API requests
export type CriterioCreateRequest = {
  name: string;
  tipo: string;
  peso: number;
  description: string;
  idCiclo: number;
  trilhaId: number;
  enabled: boolean;
};

export type CriterioUpdateRequest = {
  id: number;
  name?: string;
  tipo?: string;
  peso?: number;
  description?: string;
  enabled?: boolean;
};

export type CriterioBulkRequest = {
  criterios: (CriterioCreateRequest | CriterioUpdateRequest)[];
};
