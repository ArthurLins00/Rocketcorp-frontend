import { EvaluationItemCard } from "./EvaluationsItemCard";
import type { Equalizacao } from "../types/Equalizacao";

interface EvaluationCardProps {
  equalizacoes: Equalizacao[];
}

export const EvaluationCard = ({ equalizacoes }: EvaluationCardProps) => (
  <div className="bg-white rounded-lg border border-[#CECDCD] p-6 w-full h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-bold">Suas avaliações</span>
    </div>
    {equalizacoes.map((eq, idx) => (
      <EvaluationItemCard
        key={eq.idEqualizacao ?? idx}
        title={`Ciclo`}
        status={eq.status}
        statusColor={
          eq.status === "Finalizado"
            ? "bg-[#219653]/20 text-[#219653]"
            : "bg-[#F2C94C]/20 text-[#F2C94C]"
        }
        summary={"Descricao da performance do usuario"}
        score={eq.notaFinal?.toFixed(1)}
        scoreLabel={
          eq.notaFinal
            ? eq.notaFinal >= 4
              ? "Great"
              : eq.notaFinal >= 3
              ? "Good"
              : "Regular"
            : ""
        }
        scoreColor={
          eq.notaFinal
            ? eq.notaFinal >= 4
              ? "text-[#219653]"
              : eq.notaFinal >= 3
              ? "text-[#27B3B7]"
              : "text-[#F2C94C]"
            : ""
        }
        icon={<span className="text-2xl text-gray-400">-</span>}
      />
    ))}
  </div>
);
