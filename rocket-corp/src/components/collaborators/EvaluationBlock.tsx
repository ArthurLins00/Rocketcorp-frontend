import type { CriterionBlock } from '../../models/criterions';
import EvaluationItem from './EvaluationItem';
interface Props {
  block: CriterionBlock;
  onScoreChange: (id: string, score: number) => void;
  onJustificationChange: (id: string, text: string) => void;
}
const EvaluationBlock: React.FC<Props> = ({ block, onScoreChange, onJustificationChange }) => (
  <>
  <div className="flex flex-col space-y-4 w-full py-10">
    {/* """header""" */}
    <div className="flex flex-row items-center justify-between">
      <h3 className="[font-family:'Inter-Bold',Helvetica] font-bold text-base text-[#08605f]">{block.name}</h3>
      <div className="flex flex-row space-x-3">
        <div className="flex justify-center items-center w-[42px] h-[31px] bg-[#e6e6e6] rounded-[4.6px]">
          <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[16px] text-[#08605f]"> 4.0 </span>
        </div>
        <div className="flex justify-center items-center w-[42px] h-[31px] bg-[#08605f] rounded-[4.6px]">
          <span className="[font-family:'Inter-Bold',Helvetica] font-medium text-[16px] text-white"> - </span>
        </div>
        <div className="flex justify-center items-center h-[31px] bg-[#23a09f40] rounded-[5px]">
          <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-xs text-[#23a09f] px-[6px]"> 4/5 preenchidos </span>
        </div>
      </div>
    </div>
    {block.criteria.map(crit => (
      <EvaluationItem
        key={crit.id}
        criterion={crit}
        onScoreChange={onScoreChange}
        onJustificationChange={onJustificationChange}
      />
    ))}
  </div>
  </>
);
export default EvaluationBlock;