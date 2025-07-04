import { EvaluationItemCard } from "./EvaluationsItemCard";

export const EvaluationCard = () => (
  <div className="bg-white rounded-lg border border-[#CECDCD] p-6 w-full h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-bold">Suas avaliações</span>
      <a
        href="#"
        className="text-[#219653] font-semibold text-sm hover:underline"
      >
        Ver mais
      </a>
    </div>
    <EvaluationItemCard
      title="Ciclo 2025.1"
      status="Em andamento"
      statusColor="bg-[#F2C94C]/20 text-[#F2C94C]"
      summary="Você se saiu muito bem por conta disso e isso"
      icon={<span className="text-2xl text-gray-400">-</span>}
    />
    <EvaluationItemCard
      score="4.5"
      scoreLabel="Great"
      scoreColor="text-[#219653]"
      title="Ciclo 2024.2"
      status="Finalizado"
      statusColor="bg-[#219653]/20 text-[#219653]"
      summary="Você se saiu muito bem por conta disso e isso"
    />
    <EvaluationItemCard
      score="4.1"
      scoreLabel="Good"
      scoreColor="text-[#27B3B7]"
      title="Ciclo 2024.1"
      status="Finalizado"
      statusColor="bg-[#219653]/20 text-[#219653]"
      summary="Você se saiu muito bem por conta disso e isso"
    />
    <EvaluationItemCard
      score="3.2"
      scoreLabel="Regular"
      scoreColor="text-[#F2C94C]"
      title="Ciclo 2023.2"
      status="Finalizado"
      statusColor="bg-[#219653]/20 text-[#219653]"
      summary="Você se saiu muito bem por conta disso e isso"
    />
  </div>
);
