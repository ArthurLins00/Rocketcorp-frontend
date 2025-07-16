import { StatusCycleCard } from "../components/StatusCycleCard";
import { useEffect, useState } from "react";
import Frame4 from "../assets/Frame (4).svg";
import Ellipse11 from "../assets/Ellipse 11.svg";
import Frame3 from "../assets/Frame (3).svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame6 from "../assets/Frame (6).svg";
import { CardNotaAtual } from "../components/DashboardCards/CardNotaAtual";
import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import {
  buscarCicloAtual,
  buscarMentorados,
  buscarAutoavaliacoes,
  buscarAvaliacoes360,
  buscarLastFinalizado,
  buscaLiderados,
  buscarAllMentores,
  buscaEqualizacao,
} from "../services/dashboardService";
import { calcularPorcentagemTodosTipos } from "../utils/porcentagensAvaliacoes";
import { CardAvaliacoesPendentes } from "../components/DashboardCards/CardAvaliacoesPendentes";
import { calcularNumAvalPendentesAvaliador } from "../utils/porcentagensAvaliacoes";

import type { User } from "../types/User";
import type { Ciclo } from "../types/Ciclo";
import { CardRevisoesPendentes } from "../components/DashboardCards/CadRevisoesPendentes";
import type { Equalizacao } from "../types/Equalizacao";

const DashboardGestor = () => {
  const [status, setStatus] = useState<string>("aberto");
  const [gestor, setGestor] = useState<User>();
  // const [avaliacoesComDados, setAvaliacoesComDados] = useState<any[]>([]);
  const [porcentagem, setPorcentagem] = useState(0);
  const [numAvalPendentes, setNumAvalPendentes] = useState(0);
  const [cicloUltimo, setCicloUltimo] = useState<Ciclo | null>(null);
  const [equalizacaoGestor, setEqualizacaoGestor] =
    useState<Equalizacao | null>(null);

  //Buscar dados do gestor
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const userId = userObj.id ?? null;
      console.log("User object from localStorage:", userObj);
      console.log("User id from localStorage:", userId);

      setGestor(userObj);
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);

  //Buscar ciclo atual
  useEffect(() => {
    buscarCicloAtual()
      .then((ciclo) => {
        setStatus(ciclo.status);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, []);

  //Buscar ultimo ciclo finalizado
  useEffect(() => {
    buscarLastFinalizado()
      .then((ciclo) => {
        setCicloUltimo(ciclo);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, []);

  useEffect(() => {
    if (cicloUltimo?.id && gestor?.id) {
      buscaEqualizacao(cicloUltimo.id, gestor.id)
        .then((equalizacao) => {
          setEqualizacaoGestor(equalizacao);
        })
        .catch((erro) => {
          console.error(erro);
        });
    }
  }, [cicloUltimo, gestor]);

  console.log("equalizacao", equalizacaoGestor?.notaFinal);

  //Buscar mentorados e suas avaliacoes
  useEffect(() => {
    if (!gestor?.id) return;

    Promise.all([
      //mudar esse buscar mentorados
      buscarMentorados(gestor.id),
      buscarAllMentores(),
      buscarAutoavaliacoes(),
      buscarAvaliacoes360(),
      buscaLiderados(gestor.id),
    ])
      .then(
        ([mentorados, mentores, autoAvaliacoes, avaliacoes360, liderados]) => {
          console.log("Mentorados:", mentorados);
          console.log("Avaliações:", autoAvaliacoes);
          console.log("Avaliações:", avaliacoes360);

          const porcent = calcularPorcentagemTodosTipos(
            liderados,
            autoAvaliacoes
          );
          console.log("Porcent:", porcent);
          setPorcentagem(porcent);

          // Calcular porcentagem de avaliações 360 pendentes do avaliador
          const numAvalPendentes = calcularNumAvalPendentesAvaliador(
            liderados,
            avaliacoes360,
            gestor.id,
            mentores
          )[1];
          console.log("numero avalicoes pendentes", numAvalPendentes);
          setNumAvalPendentes(numAvalPendentes);
        }
      )
      .catch((erro) => {
        console.error(erro);
      });
  }, [gestor]);

  useEffect(() => {
    console.log("Porcentagem atualizada:", porcentagem);
  }, [porcentagem]);

  // useEffect(() => {
  //   buscarAvaliacoesDoAvaliador(26)
  //     .then(async (avaliacoesData) => {
  //       console.log("Avaliações recebidas:", avaliacoesData);

  //       const avaliacoesCompletas = await Promise.all(
  //         avaliacoesData.map(async (avaliacao: Avaliacao360) => {
  //           console.log(
  //             "Buscando dados do colaborador ID:",
  //             avaliacao.idAvaliado
  //           );

  //           const dadosColaborador = await buscarDadosDashboardUser(
  //             avaliacao.idAvaliado
  //           );

  //           // console.log("Dados do colaborador recebidos:", dadosColaborador);

  //           const dadosDoCiclo = await buscarDadosCiclo(
  //             avaliacao.idAvaliado,
  //             avaliacao.idCiclo
  //           );

  //           console.log("Dados do ciclo:", dadosDoCiclo);

  //           return { ...avaliacao, ...dadosColaborador, ...dadosDoCiclo };
  //         })
  //       );

  //       console.log(
  //         "Avaliações completas com dados dos colaboradores:",
  //         avaliacoesCompletas
  //       );
  //       setAvaliacoesComDados(avaliacoesCompletas);
  //     })
  //     .catch((erro) => {
  //       console.error(erro);
  //     });
  // }, []);

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
  } else if (status === "finalizado") {
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
            <strong>Olá</strong>, {gestor ? gestor.name : "carregando..."}!
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
                status === "aberto" ? (
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
        </div>
        {/* Grid de 3 colunas para os cards */}
        <div className="flex flex-col gap-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <CardNotaAtual
              cicloFinalizado={cicloUltimo}
              notaFinal={equalizacaoGestor?.notaFinal ?? 0}
            />
            <CardPreenchimento porcentagemPreenchimento={porcentagem} />

            {/* aparece um ou outro dependendo do status */}
            <CardAvaliacoesPendentes porcentagemPendentes={numAvalPendentes} />

            {/* numero de liderados - numero de avaliacoes360 gestor PARA liderado  */}
            <CardRevisoesPendentes />
          </div>
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Colaboradores</span>
                <a
                  href="#"
                  className="text-[#219653] font-semibold text-sm hover:underline"
                >
                  Ver mais
                </a>
              </div>
              {/* <div className="max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {avaliacoesComDados?.map((item: AvaliacaoCompleta) => (
                  <CollaboratorCard
                    key={item.id}
                    name={item.avaliado?.name || "Carregando..."}
                    role={item.unidade || "Carregando..."}
                    initials="AC"
                    status="EM ANDAMENTO"
                    selfRating={4}
                    managerRating={5}
                    onlyManager
                    id={""}
                  />
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardGestor;
