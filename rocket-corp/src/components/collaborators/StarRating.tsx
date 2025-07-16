import { IoMdStar, IoMdStarOutline, IoMdStarHalf } from 'react-icons/io';
import React from 'react';

interface StarRatingProps {
  value: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  color?: string;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, readOnly = true, onChange, color = '#08605F', size = 24 }) => {
  return (
    <div className="flex items-center space-x-0.5 gap-5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = value >= i + 1;
        const halfFilled = !filled && value >= i + 0.5;
        let Icon = IoMdStarOutline;
        if (filled) Icon = IoMdStar;
        else if (halfFilled) Icon = IoMdStarHalf;
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Icon
              className={`w-full h-full ${readOnly ? '' : 'cursor-pointer'}`}
              color={color}
              size={size}
            />
            {!readOnly && (
              <div className="absolute inset-0 flex">
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={() => onChange?.(i + 0.5)}
                  title={`Nota: ${(i + 0.5).toFixed(1)}`}
                />
                <div
                  className="w-1/2 h-full cursor-pointer"
                  onClick={() => onChange?.(i + 1)}
                  title={`Nota: ${(i + 1).toFixed(1)}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
  