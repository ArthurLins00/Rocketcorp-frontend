import type { CriterionBlock } from '../../models/criterions';
import EvaluationBlock from '../../components/collaborators/EvaluationBlock';
import type { Collaborator } from '../../models/collaborator';

export type Cycle = {
  id: string | number;
  status: string;
};

interface EvaluationPageProps {
  blocks: CriterionBlock[];
  onScoreChange: (id: string, score: number) => void;
  onJustificationChange: (id: string, text: string) => void;
  ciclo?: Cycle;
  collaborator?: Collaborator;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ blocks, onScoreChange, onJustificationChange }) => {
    return (
        <>
        <div className="bg-white rounded-xl px-7">
            {blocks.map((block, idx) => (
              <>
                <EvaluationBlock
                  key={block.id}
                  block={block}
                  onScoreChange={onScoreChange}
                  onJustificationChange={onJustificationChange}
                />
                {idx < blocks.length - 1 && (
                  <hr className=" border-t border-gray-200" />
                )}
              </>
            ))}
        </div>
      </>
    )
}