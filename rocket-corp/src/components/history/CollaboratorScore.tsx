import React from 'react';
import { IoIosStar } from 'react-icons/io';

interface CollaboratorScoreProps {
  score: number;
  semester: string;
}

const getScoreColor = (score: number) => {
  if (score > 4) return '#219653'; // Green
  if (score > 2.5) return '#F2C94C'; // Yellow
  return '#E74C3C'; // Red
};

const getScoreDescription = (score: number) => {
  if (score >= 4.5) return 'Excelente';
  if (score >= 4) return 'Muito bom';
  if (score >= 3.5) return 'Bom';
  if (score >= 2.5) return 'Regular';
  return 'Precisa melhorar';
};

export const CollaboratorScore: React.FC<CollaboratorScoreProps> = ({ score, semester }) => {
  const scoreColor = getScoreColor(score);
  const scoreDescription = getScoreDescription(score);

  return (
    <div className="bg-white rounded-lg pt-4 pb-6 pl-6 h-full flex">
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Nota atual</h3>
        
        <div className="flex items-start gap-3 flex-1">
          {/* Vertical line with score color */}
          <div 
            className="w-1 h-full rounded-full min-h-[40px]"
            style={{ backgroundColor: scoreColor }}
          ></div>
          
          {/* Text with line break */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-tight break-words">
              Nota final do ciclo realizado em {semester}
            </p>
          </div>
        </div>
      </div>

      {/* Second Column */}
      <div className="flex items-center justify-center px-4 gap-2">
        {/* Star icon */}
        <IoIosStar 
          className="text-4xl text-[#219653]"
        />
        
        <div className="flex flex-col items-center">
          {/* Score */}
          <div 
            className="text-2xl font-bold"
            style={{ color: scoreColor }}
          >
            {score.toFixed(1)}
          </div>
          
          {/* Description */}
          <div 
            className="text-xs font-medium text-center"
            style={{ color: scoreColor }}
          >
            {scoreDescription}
          </div>
        </div>
      </div>
    </div>
  );
};
