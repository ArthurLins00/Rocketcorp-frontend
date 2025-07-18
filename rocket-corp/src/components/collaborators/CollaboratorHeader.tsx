import AvatarInicial from "../AvatarInicial";

interface HeaderProps {
  title: string;
  initials: string;
  role: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}
export const Header: React.FC<HeaderProps> = ({ title, initials, role, actionLabel, actionDisabled, onAction }) => (

  <>
  <header className="flex flex-row justify-between bg-white pt-8 pb-4 px-8">
    <div className="flex flex-row space-x-4">
      {/* avatar */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full overflow-hidden p-0 m-0">
        <AvatarInicial nome={title} tamanho={56} />
      </div>
      <div className="flex flex-col">
        <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#1c1c1c] text-[19.6px] "> {title} </h1>
        <h1 className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1cbf] text-[16.8px] "> {role} </h1>

      </div>
    </div>
       
       <button
         onClick={onAction}
          disabled={actionDisabled}
        className="all-[unset] box-border inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-[#08605f] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#025352] transition"
      >
        <div className="[font-family:'Inter-Bold',Helvetica] font-bold text-sm text-white"> {actionLabel} </div>
       
      </button>
    
  </header>
  </>
);