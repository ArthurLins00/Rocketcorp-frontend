import React from 'react';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';

interface CollaboratorGrowthProps {
  currentScore: number;
  lastScore: number;
  lastCycle: string;
  title?: string;
}

const getGrowthColor = (growth: number) => {
  if (growth > 0) return '#219653'; // Green for positive growth
  if (growth < 0) return '#E74C3C'; // Red for negative growth
  return '#F2C94C'; // Yellow for no growth
};

const getGrowthDescription = (growth: number) => {
  if (growth >= 1.0) return 'Excelente';
  if (growth >= 0.5) return 'Muito bom';
  if (growth >= 0.2) return 'Bom';
  if (growth > 0) return 'Regular';
  if (growth === 0) return 'Estável';
  return 'Precisa melhorar';
};

export const CollaboratorGrowth: React.FC<CollaboratorGrowthProps> = ({ 
  currentScore, 
  lastScore, 
  lastCycle,
  title
}) => {
  const growth = currentScore - lastScore;
  const growthColor = getGrowthColor(growth);
  const growthDescription = getGrowthDescription(growth);
  const isPositive = growth > 0;
  const ArrowIcon = isPositive ? IoIosArrowRoundUp : IoIosArrowRoundDown;

  return (
    <div className="bg-white rounded-lg pt-4 pb-6 pl-6 h-full flex">
      {/* First Column */}
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{title || 'Crescimento'}</h3>
        
        <div className="flex items-start gap-3 flex-1">
          {/* Vertical line with growth color */}
          <div 
            className="w-1 h-full rounded-full min-h-[40px]"
            style={{ backgroundColor: growthColor }}
          ></div>
          
          {/* Text with line break */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-tight break-words">
              Em comparação ao ciclo {lastCycle}
            </p>
          </div>
        </div>
      </div>

      {/* Second Column */}
      <div className="flex items-center justify-center px-4 gap-2">
        {/* Arrow icon */}
        <ArrowIcon 
          className="text-4xl"
          style={{ color: growthColor }}
        />
        
        <div className="flex flex-col items-center">
          {/* Growth difference */}
          <div 
            className="text-2xl font-bold"
            style={{ color: growthColor }}
          >
            {growth > 0 ? '+' : ''}{growth.toFixed(1)}
          </div>
          
          {/* Description */}
          <div 
            className="text-xs font-medium text-center"
            style={{ color: growthColor }}
          >
            {growthDescription}
          </div>
        </div>
      </div>
    </div>
  );
};
