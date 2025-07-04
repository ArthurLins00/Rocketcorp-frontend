import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardAvaliacoesPendentes } from "../components/DashboardCards/CardAvaliacoesPendentes";
import { CardFechamentoDeCiclo } from "../components/DashboardCards/CardFechamentoDeCiclo";
import { DashboardSmallerCollaboratorCard } from "../components/DashboardCards/DashboardSmallerCollaboratorCard";
import { PreenchimentoChart } from "../components/PreenchimentoChart";
import { useState, useEffect } from "react";
import {
  buscaAllUsers,
  buscarAutoavaliacoes,
  buscarAvaliacoes360,
  buscarDadosDashboardUser,
} from "../services/dashboardService";
import {
  calcularAvalPendentesComite,
  calcularNumAvalPendentesAvaliador,
} from "../utils/porcentagensAvaliacoes";

const DashboardRH = () => {
  const [porcentagem, setPorcentagem] = useState<any>(null);
  const [numAvalPendentes, setNumAvalPendentes] = useState<any>(null);
  const [rh, setRH] = useState<any>(null);

  useEffect(() => {
    buscarDadosDashboardUser("26")
      .then((dados) => {
        setRH(dados);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, []);

  useEffect(() => {
    if (!rh?.id) return;

    Promise.all([
      buscaAllUsers(),
      buscarAutoavaliacoes(),
      buscarAvaliacoes360(),
    ])
      .then(([users, autoAvaliacoes, avaliacoes360]) => {
        console.log("Users:", users);
        console.log("Auto Avaliações:", autoAvaliacoes);
        console.log("Avaliações 360:", avaliacoes360);

        // Calcular porcentagem de avaliações 360 pendentes do avaliador
        const porcentPendentes = calcularAvalPendentesComite(
          users,
          autoAvaliacoes,
          avaliacoes360
        );
        setPorcentagem(porcentPendentes);

        console.log("RH", rh);
        const numAvalPendentes = calcularNumAvalPendentesAvaliador(
          users,
          avaliacoes360,
          rh.id
        );
        setNumAvalPendentes(numAvalPendentes);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, [rh]);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-row p-10">
        <div className="mb-6">
          <span className="text-lg ml-2">
            <strong>Olá</strong>, RH!
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
          {/* StatusCycleCard ocupa as duas colunas no desktop */}
          <div className="col-span-1 md:col-span-2"></div>
        </div>
        {/* Grid de 3 colunas para os cards */}
        <div className="flex flex-col gap-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <CardPreenchimento porcentagemPreenchimento={porcentagem} />
            <CardAvaliacoesPendentes porcentagemPendentes={numAvalPendentes} />
            <CardFechamentoDeCiclo />
          </div>
          <div className="flex gap-x-6">
            <DashboardSmallerCollaboratorCard />
            <PreenchimentoChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardRH;
