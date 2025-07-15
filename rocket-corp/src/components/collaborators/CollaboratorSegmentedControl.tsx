interface SegmentedControlProps {
    options: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
  }
  export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedIndex, onChange }) => (
    <>
    <nav className="flex flex-row h-12 items-end bg-white space-x-4">
      {options.map((opt, idx) => (
        <button 
          key={opt}
          onClick={() => onChange(idx)}
        >
          <div className={`flex flex-col items-center space-y-[11px] w-[180px] transform transition-transform duration-200 hover:scale-105`}>
            <div className="flex flex-row space-x-3 items-center">
              <span className={` ${selectedIndex === idx ? "[font-family:'Inter-Bold',Helvetica] font-bold text-[#08605f]" : "[font-family:'Inter-Regular',Helvetica] font-normal text-[#1D1D1D]" } text-sm`}>{opt}</span>
              {selectedIndex === idx && <div className="w-[10px] h-[10px] rounded-full bg-red-500"/> }
            </div>
            <div className={` ${selectedIndex === idx ? "w-[80%] h-0.5 mb-[-1.50px] bg-[#08605f] rounded" : ""} `}/>
          </div>
        </button>
      ))}
    </nav>
    </>
  );