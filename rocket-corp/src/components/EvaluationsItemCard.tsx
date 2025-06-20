// rocket-corp/src/components/EvaluationItemCard.tsx
interface EvaluationItemCardProps {
  score?: string;
  scoreLabel?: string;
  scoreColor?: string;
  title: string;
  status: string;
  statusColor: string;
  summary: string;
  icon?: React.ReactNode;
}

export const EvaluationItemCard = ({
  score,
  scoreLabel,
  scoreColor = "text-[#219653]",
  title,
  status,
  statusColor,
  summary,
  icon,
}: EvaluationItemCardProps) => (
  <div className="flex items-center bg-white rounded-lg border border-[#E0E0E0] px-4 py-3 mb-3 shadow-sm">
    {/* Nota ou ícone */}
    <div className="flex flex-col items-center justify-center w-20 h-20 bg-[#F8F8F8] rounded-lg mr-4">
      {score ? (
        <>
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
          <span className="text-sm font-semibold">{scoreLabel}</span>
        </>
      ) : (
        icon || <span className="text-2xl text-gray-400">-</span>
      )}
    </div>
    {/* Conteúdo */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-lg text-[#1D1D1D]">{title}</span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded ${statusColor}`}
        >
          {status}
        </span>
      </div>
      <div className="text-sm">
        <span className="font-bold">Resumo </span>
        <span className="text-[#4F4F4F]">{summary}</span>
      </div>
    </div>
  </div>
);
