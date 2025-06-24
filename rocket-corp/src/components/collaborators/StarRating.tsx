import { IoMdStar, IoMdStarOutline, IoMdStarHalf } from 'react-icons/io';
interface StarRatingProps {
  value: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}
const StarRating: React.FC<StarRatingProps> = ({ value, readOnly = true, onChange }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1).map(i => {
      const diff = value - i;
      let Icon = IoMdStarOutline;
      if (diff >= 0) Icon = IoMdStar;
      else if (diff > -1) Icon = IoMdStarHalf;
      return Icon;
    });
    return (
      <div className="flex items-center space-x-0.5">
        {stars.map((Icon, idx) => (
          <Icon
            key={idx}
            className={`h-5 w-5 cursor-${readOnly ? 'default' : 'pointer'}`}
            onClick={() => !readOnly && onChange?.(idx + 1)}
          />
        ))}
      </div>
    );
  };
  export default StarRating;
  