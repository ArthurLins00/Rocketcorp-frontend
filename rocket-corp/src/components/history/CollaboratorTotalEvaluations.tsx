import React from 'react';
import { IoMdPeople } from 'react-icons/io';

interface CollaboratorTotalEvaluationsProps {
  totalEvaluations: number;
  title?: string;
}

export const CollaboratorTotalEvaluations: React.FC<CollaboratorTotalEvaluationsProps> = ({ 
  totalEvaluations,
  title
}) => {
  const cardColor = '#08605F';

  return (
    <div className="bg-white rounded-lg pt-4 pb-6 pl-6 h-full flex">
      {/* First Column */}
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{title || 'Avaliações realizadas'}</h3>
        
        <div className="flex items-start gap-3 flex-1">
          {/* Vertical line with fixed color */}
          <div 
            className="w-1 h-full rounded-full min-h-[40px]"
            style={{ backgroundColor: cardColor }}
          ></div>
          
          {/* Text with line break */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-tight break-words">
              Total de avaliações
            </p>
          </div>
        </div>
      </div>

      {/* Second Column */}
      <div className="flex items-center justify-center px-4 gap-2">
        {/* Users icon */}
        <IoMdPeople 
          className="text-4xl"
          style={{ color: cardColor }}
        />
        
        <div className="flex flex-col items-center">
          {/* Total evaluations */}
          <div 
            className="text-2xl font-bold"
            style={{ color: cardColor }}
          >
            {totalEvaluations}
          </div>
        </div>
      </div>
    </div>
  );
};
