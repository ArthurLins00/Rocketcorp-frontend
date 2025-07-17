import { EvaluationCard } from "../components/EvaluationCard";
import { PerformanceChart } from "../components/PerformanceChart";
import { StatusCycleCard } from "../components/StatusCycleCard";
import { useEffect, useState } from "react";
import Frame4 from "../assets/Frame (4).svg";
import Ellipse11 from "../assets/Ellipse 11.svg";
import Frame3 from "../assets/Frame (3).svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame6 from "../assets/Frame (6).svg";
import { CardNotaAtual } from "../components/DashboardCards/CardNotaAtual";
import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardRevisoesPendentes } from "../components/DashboardCards/CadRevisoesPendentes";
import { CardPrazo } from "../components/DashboardCards/CardPrazo";
import { CardEqualizacoesPendentes } from "../components/DashboardCards/CardEqualizacoesPendentes";
import { CardFechamentoDeCiclo } from "../components/DashboardCards/CardFechamentoDeCiclo";
import { CardAvaliacoesPendentes } from "../components/DashboardCards/CardAvaliacoesPendentes";

import { DashboardSmallerCollaboratorCard } from "../components/DashboardCards/DashboardSmallerCollaboratorCard";
import { DashboardCollaboratorCard } from "../components/DashboardCards/DashboardCollaboratorCard";
import { PreenchimentoChart } from "../components/PreenchimentoChart";
import { useUserType } from "../contexts/UserTypeContext";

export const Dashboard = () => {
  const { userType } = useUserType();

  type CycleStatus =
    | "EM ANDAMENTO"
    | "AGUARDANDO RESULTADO"
    | "RESULTADOS DISPONIVEIS";
  const [status, setStatus] = useState<CycleStatus>("RESULTADOS DISPONIVEIS");
  useEffect(() => {
    setTimeout(() => {
      setStatus("RESULTADOS DISPONIVEIS");
    }, 500);
  }, []);
  let bgColor, textColor, subtitle, title, iconLeft, subTextColor;

  if (status === "EM ANDAMENTO") {
    bgColor = "bg-[#08605F]";
    textColor = "text-white";
    subtitle = "15 dias restantes";
    title = "Ciclo de avaliação em andamento";
    iconLeft = <img src={Frame3} alt="Ícone" className="w-10 h-10" />;
  } else if (status === "AGUARDANDO RESULTADO") {
    bgColor = "bg-white";
    textColor = "text-black";
    subTextColor = "text-black";
    subtitle = "Resultados disponíveis em breve";
    title = "Ciclo de avaliação finalizado";
    iconLeft = <img src={Frame1} alt="Ícone" className="w-10 h-10" />;
  } else {
    bgColor = "bg-white";
    textColor = "text-[#096160]";
    subTextColor = "text-[#096160]";
    subtitle = "Resultados disponíveis";
    title = "Ciclo de avaliação finalizado";
    iconLeft = <img src={Frame6} alt="Ícone" className="w-10 h-10" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-row p-6">
        {/* Saudação */}

        {userType.includes("COLABORADOR") && (
          <>
            <div className="mb-6">
              <span className="text-lg ml-2">
                <strong>Olá</strong>, Colaborador!
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
              {/* StatusCycleCard ocupa as duas colunas no desktop */}
              <div className="col-span-1 md:col-span-2">
                <StatusCycleCard
                  title={title}
                  bgColor={bgColor}
                  textColor={textColor}
                  subtitle={subtitle}
                  iconLeft={iconLeft}
                  subTextColor={subTextColor}
                  iconRight={
                    status === "EM ANDAMENTO" ? (
                      <img src={Frame4} alt="seta" className="w-10 h-10" />
                    ) : (
                      <div className="relative flex items-center justify-center w-10 h-10">
                        <img
                          src={Ellipse11}
                          alt="círculo"
                          className="absolute w-full h-full"
                        />
                        <img
                          src={Frame4}
                          alt="seta"
                          className="relative w-5 h-5"
                        />
                      </div>
                    )
                  }
                />
              </div>
              {/* Cards lado a lado, sempre com a mesma altura */}
              <div className="flex flex-col h-full">
                <EvaluationCard />
              </div>
              <div className="flex flex-col h-full">
                <PerformanceChart />
              </div>
            </div>
          </>
        )}

        {userType.includes("GESTOR") && (
          <>
            <div className="mb-6">
              <span className="text-lg ml-2">
                <strong>Olá</strong>, Gestor!
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
              {/* StatusCycleCard ocupa as duas colunas no desktop */}
              <div className="col-span-1 md:col-span-2">
                <StatusCycleCard
                  title={title}
                  bgColor={bgColor}
                  textColor={textColor}
                  subtitle={subtitle}
                  iconLeft={iconLeft}
                  subTextColor={subTextColor}
                  iconRight={
                    status === "EM ANDAMENTO" ? (
                      <img src={Frame4} alt="seta" className="w-10 h-10" />
                    ) : (
                      <div className="relative flex items-center justify-center w-10 h-10">
                        <img
                          src={Ellipse11}
                          alt="círculo"
                          className="absolute w-full h-full"
                        />
                        <img
                          src={Frame4}
                          alt="seta"
                          className="relative w-5 h-5"
                        />
                      </div>
                    )
                  }
                />
              </div>
            </div>
            {/* Grid de 3 colunas para os cards */}

            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <CardNotaAtual />
                <CardPreenchimento />
                <CardRevisoesPendentes />
              </div>
              <div>
                <DashboardCollaboratorCard />
              </div>
            </div>
          </>
        )}
        {userType.includes("COMITE") && (
          <>
            <div className="mb-6">
              <span className="text-lg ml-2">
                <strong>Olá</strong>, Comitê!
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
              {/* StatusCycleCard ocupa as duas colunas no desktop */}
              <div className="col-span-1 md:col-span-2"></div>
            </div>
            {/* Grid de 3 colunas para os cards */}
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <CardPrazo />
                <CardPreenchimento />
                <CardEqualizacoesPendentes />
              </div>
              <div>
                <DashboardCollaboratorCard />
              </div>
            </div>
          </>
        )}
        {userType.includes("RH") && (
          <>
            {userType.length === 1 && (
              <div className="mb-6">
                <span className="text-lg ml-2">
                  <strong>Olá</strong>, RH!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
              {/* StatusCycleCard ocupa as duas colunas no desktop */}
              <div className="col-span-1 md:col-span-2"></div>
            </div>
            {/* Grid de 3 colunas para os cards */}
            <div className="flex flex-col gap-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <CardPreenchimento />
                <CardAvaliacoesPendentes />
                <CardFechamentoDeCiclo />
              </div>
              <div className="flex gap-x-6">
                <DashboardSmallerCollaboratorCard />
                <PreenchimentoChart />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
