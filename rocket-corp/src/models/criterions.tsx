export interface Criterion {
    id: string;
    name: string;
    selfScore: number;
    selfJustification: string;
    managerScore?: number;
    managerJustification?: string;
}

export interface CriterionBlock {
    id: string;
    name: string;
    criteria: Criterion[];
}