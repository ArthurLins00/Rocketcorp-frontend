import { EvaluationCard } from "../components/EvaluationCard";
import { PerformanceChart } from "../components/PerformanceChart";
import { StatusCycleCard } from "../components/StatusCycleCard";
import { useEffect, useState } from "react";
import Frame4 from "../assets/Frame (4).svg";
import Ellipse11 from "../assets/Ellipse 11.svg";
import Frame3 from "../assets/Frame (3).svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame6 from "../assets/Frame (6).svg";
import {
  buscaEqualizacoesAvaliado,
  buscarCicloAtual,
} from "../services/dashboardService";
import type { Equalizacao } from "../types/Equalizacao";
import type { User } from "../types/User";

const DashboardColaborador = () => {
  const [status, setStatus] = useState<string>();
  const [colaborador, setColaborador] = useState<User>();
  const [equalizacoesColaborador, setEqualizacoesColaborador] = useState<
    Equalizacao[] | null
  >(null);

  useEffect(() => {
    buscarCicloAtual()
      .then((ciclo) => {
        setStatus(ciclo.status);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const userId = userObj.id ?? null;
      console.log("User object from localStorage:", userObj);
      console.log("User id from localStorage:", userId);

      setColaborador(userObj);
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);

  //retorna um array de todas as equalizacoes daquele colaborador

  useEffect(() => {
    if (!colaborador?.id) return;
    buscaEqualizacoesAvaliado(colaborador.id)
      .then((equalizacoes) => {
        console.log(
          "RETORNO DA API:",
          equalizacoes,
          Array.isArray(equalizacoes),
          equalizacoes.length
        );
        setEqualizacoesColaborador(equalizacoes);
      })
      .catch(console.error);
  }, [colaborador]);

  console.log(equalizacoesColaborador);

  let bgColor, textColor, subtitle, title, iconLeft, subTextColor;

  if (
    status === "aberto" ||
    status === "revisao_gestor" ||
    status === "revisao_comite"
  ) {
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
      <main className="flex-row p-10">
        <div className="mb-6">
          <span className="text-lg ml-2">
            <strong>Olá</strong>,{" "}
            {colaborador ? colaborador.name : "carregando..."}!
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
                    <img src={Frame4} alt="seta" className="relative w-5 h-5" />
                  </div>
                )
              }
            />
          </div>
          {/* Cards lado a lado, sempre com a mesma altura */}
          <div className="flex flex-col h-full">
            <EvaluationCard equalizacoes={equalizacoesColaborador ?? []} />
          </div>
          <div className="flex flex-col h-full">
            <PerformanceChart equalizacoes={equalizacoesColaborador ?? []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardColaborador;
