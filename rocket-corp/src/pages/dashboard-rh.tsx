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
  buscarAllMentores,
  buscarCicloAtual,
} from "../services/dashboardService";
import {
  calcularAvalPendentesComite,
  calcularNumAvalPendentesAvaliador,
} from "../utils/porcentagensAvaliacoes";

interface RH {
  id: number;
  name: string;
}

interface Ciclo {
  id: number;
  dataFinalizacao: string | null;
}

const DashboardRH = () => {
  const [porcentagem, setPorcentagem] = useState<number | null>(null);
  const [numAvalPendentes, setNumAvalPendentes] = useState<number | null>(null);
  const [rh, setRH] = useState<RH | null>(null);
  const [cicloAtual, setCicloAtual] = useState<Ciclo | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const userId = userObj.id ?? null;
      console.log("User object from localStorage:", userObj);
      console.log("User id from localStorage:", userId);

      setRH(userObj);
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);

  useEffect(() => {
    // Buscar ciclo atual
    buscarCicloAtual()
      .then((ciclo) => {
        setCicloAtual(ciclo);
      })

      .catch((erro) => {
        console.error("Erro ao buscar ciclo atual:", erro);
      });
  }, []);
  console.log("CICLO ATUAL", cicloAtual);

  useEffect(() => {
    if (!rh?.id) return;

    Promise.all([
      buscaAllUsers(),
      buscarAutoavaliacoes(),
      buscarAvaliacoes360(),
      buscarAllMentores(),
    ])
      .then(([users, autoAvaliacoes, avaliacoes360, mentores]) => {
        console.log("Users:", users);
        console.log("Auto Avaliações:", autoAvaliacoes);
        console.log("Avaliações 360:", avaliacoes360);

        // Calcular porcentagem de avaliações 360 pendentes do avaliador
        const porcentPendentes = calcularAvalPendentesComite(
          users,
          autoAvaliacoes,
          mentores
        );
        setPorcentagem(porcentPendentes);

        console.log("RH", rh);
        const numAvalPendentes = calcularNumAvalPendentesAvaliador(
          users,
          avaliacoes360,
          rh.id,
          mentores
        )[0];
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
            <strong>Olá</strong>, {rh ? rh.name : "carregando..."}!
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
            <CardFechamentoDeCiclo
              dataFinalizacao={cicloAtual?.dataFinalizacao}
            />
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
