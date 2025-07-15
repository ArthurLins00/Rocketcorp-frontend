import React, { useState } from 'react';
import {
  IoIosRadioButtonOff,
  IoIosCheckmarkCircle,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosStarOutline,
  IoIosStar,
  IoIosStarHalf,
} from 'react-icons/io';

import type { Criterion } from '../../models/criterions';

interface Props {
  criterion: Criterion;
  onScoreChange: (id: string, score: number) => void;
  onJustificationChange: (id: string, text: string) => void;
}

const EvaluationItem: React.FC<Props> = ({ criterion, onScoreChange, onJustificationChange }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    name,
    selfScore,
    selfJustification,
    managerScore,
    managerJustification,
  } = criterion;

  const displayManagerScore = managerScore ?? 0;
  const displayManagerJustification = managerJustification ?? '';

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const renderStars = (score: number, interactive: boolean) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const filled = score >= i + 1;
      const halfFilled = !filled && score >= i + 0.5;
      const StarIcon = filled ? IoIosStar : halfFilled ? IoIosStarHalf : IoIosStarOutline;
      const colorClass = !interactive ? 'text-[#83AFAF]' : 'text-[#08605F]';
      stars.push(
        <div key={i} className="relative w-6 h-6">
          <StarIcon className={`w-6 h-6 ${colorClass}`} />
          {interactive && (
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={() => onScoreChange(criterion.id, i + 0.5)}
              />
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={() => onScoreChange(criterion.id, i + 1)}
              />
            </div>
          )}
        </div>,
      );
    }
    return <div className="flex space-x-6">{stars}</div>;
  };

  return (
    <>
    <div className="flex flex-col items-start pt-6 w-full">
      <div className="flex flex-row justify-between items-center w-full" onClick={toggleExpanded}>
        <div className="flex flex-row space-x-2">
          {managerScore != null ? (
            <IoIosCheckmarkCircle className="w-[19px] h-[19px] text-[#419958]" />
          ) : (
            <IoIosRadioButtonOff className="w-[19px] h-[19px] text-gray-400" />
          )}
          <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#1c1c1c] text-sm"> {name} </span>
        </div>
        <div className="flex flex-row space-x-1.5">
          <div className="flex w-[37px] h-[25px] justify-center items-center">
            <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#1c1c1cbf] text-sm"> {selfScore} </span>
          </div>
          <div className="flex w-[37px] h-[25px] justify-center items-center">
            <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#08605f] text-sm">
              {displayManagerScore > 0 ? displayManagerScore : '-'}
            </span>
          </div>
          <div className="flex w-[37px] h-[25px] justify-center items-center">
            { expanded ? (
              <IoIosArrowDown className="w-[19px] h-[19px] text-[#1c1c1c]" />
            ) : (
              <IoIosArrowForward className="w-[19px] h-[19px] text-[#1c1c1c]" />
            )}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-row pt-6 w-full space-x-4">
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col space-y-[10px]">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#1c1c1cbf] text-xs">
                Autoavaliação
              </span>
              <div>
                {renderStars(selfScore, false)}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#1c1c1cbf] text-xs">
                Justificativa
              </span>
              <div className="flex items-start justify-start bg-[#e6e6e680] rounded-md border-solid border-slate-600 h-20">
                <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1c] text-xs py-2 px-3">
                  {selfJustification || 'Nenhuma justificativa fornecida.'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col space-y-[10px]">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#1c1c1cbf] text-xs">
                Sua avaliação de 1 à 5 com base no critério
              </span>
              <div>
                {renderStars(displayManagerScore, true)}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#1c1c1cbf] text-xs">
                Justifique sua nota
              </span>
              <textarea
                className="w-full h-20 p-2 border rounded-md bg-white text-[#1c1c1c] text-xs"
                placeholder="Escreva sua justificativa aqui..."
                value={displayManagerJustification}
                onChange={e => onJustificationChange(criterion.id, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
export default EvaluationItem;