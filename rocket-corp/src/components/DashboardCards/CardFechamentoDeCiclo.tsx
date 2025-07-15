import { DashboardInfoCard } from "./DashboardInfoCards";
import { FaRegCalendarAlt } from "react-icons/fa";

interface CardFechamentoDeCicloProps {
  dataFinalizacao?: string | null;
}

export const CardFechamentoDeCiclo = ({
  dataFinalizacao,
}: CardFechamentoDeCicloProps) => {
  // Calcular dias restantes
  const calcularDiasRestantes = () => {
    if (!dataFinalizacao)
      return { dias: 0, dataFormatada: "Data não definida" };

    const hoje = new Date();
    const dataFim = new Date(dataFinalizacao);
    const diffTime = dataFim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Formatar data para exibição
    const dataFormatada = dataFim.toLocaleDateString("pt-BR");

    return { dias: diffDays, dataFormatada };
  };

  const { dias, dataFormatada } = calcularDiasRestantes();
  const diasRestantes = Math.max(0, dias); // Não mostrar dias negativos

  return (
    <DashboardInfoCard
      title="Fechamento de Ciclo"
      bgColor="bg-white"
      textColor="text-black"
    >
      <div className="flex items-center justify-between w-full mt-2">
        {/* Descrição com barra lateral verde */}
        <div className="flex items-start gap-2 flex-1">
          <span className="block w-1 h-10 bg-[#219653] rounded-full mt-1" />
          <span className="text-sm text-[#4F4F4F] leading-tight">
            {dataFinalizacao ? (
              <>
                Faltam {diasRestantes} dias para o fechamento
                <br />
                do ciclo, no dia {dataFormatada}
              </>
            ) : (
              <>
                Data de fechamento
                <br />
                não definida
              </>
            )}
          </span>
        </div>
        {/* Ícone e número de dias */}
        <div className="flex items-center gap-2 ml-6">
          <FaRegCalendarAlt className="text-[#219653] text-4xl" />
          <div className="flex flex-col items-start">
            <span className="text-4xl font-bold text-[#219653] leading-none">
              {diasRestantes}
            </span>
            <span className="text-base font-bold text-[#219653] leading-none">
              dias
            </span>
          </div>
        </div>
      </div>
    </DashboardInfoCard>
  );
};
