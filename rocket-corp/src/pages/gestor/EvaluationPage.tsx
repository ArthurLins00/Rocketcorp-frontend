import type { CriterionBlock } from '../../models/criterions';
import EvaluationBlock from '../../components/collaborators/EvaluationBlock';

interface EvaluationPageProps {
  blocks: CriterionBlock[];
  onScoreChange: (id: string, score: number) => void;
  onJustificationChange: (id: string, text: string) => void;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ blocks, onScoreChange, onJustificationChange }) => {
    return (
        <>
        <div className="bg-white rounded-xl px-7">

            {blocks.map(block => (
            <EvaluationBlock
                key={block.id}
                block={block}
                onScoreChange={onScoreChange}
                onJustificationChange={onJustificationChange}
            />
            ))}
        </div>
      </>
    )
}