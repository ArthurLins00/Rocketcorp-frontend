import { EvaluationCard } from "../components/EvaluationCard";
import { PerformanceChart } from "../components/PerformanceChart";
import { Sidebar } from "../components/Sidebar";
import { StatusCycleCard } from "../components/StatusCycleCard";
import { useEffect, useState } from "react";
import Frame5 from "../assets/Frame (5).svg";
import Frame4 from "../assets/Frame (4).svg";
import Ellipse11 from "../assets/Ellipse 11.svg";

export const Dashboard = () => {
  const [userType, setUserType] = useState<string>("COLABORADOR");
  useEffect(() => {
    setTimeout(() => {
      setUserType("GESTOR");
    }, 500);
  }, []);
  if (!userType) {
    return <div>Carregando...</div>;
  }
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-10">
        {/* Saudação */}

        {userType === "COLABORADOR" && (
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
                  title="Ciclo 2025.1 de avaliação está aberto"
                  subtitle="15 dias restantes"
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

        {userType === "GESTOR" && (
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
                  title="Ciclo 2025.1 de avaliação finalizador"
                  subtitle="Resultados disponíveis em breve"
                  textColor="text-black"
                  bgColor="bg-white"
                  subTextColor="text-black"
                  iconLeft={
                    <img src={Frame5} alt="Ícone" className="w-10 h-10" />
                  }
                  iconRight={
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
      </main>
    </div>
  );
};
