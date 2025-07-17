import { CardPrazo } from "../components/DashboardCards/CardPrazo";
import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardEqualizacoesPendentes } from "../components/DashboardCards/CardEqualizacoesPendentes";
import { DashboardCollaboratorCard } from "../components/DashboardCards/DashboardCollaboratorCard";
import { useEffect, useState } from "react";
import {
  buscaAllUsers,
  buscarAllMentores,
  buscarAutoavaliacoes,
  buscarCicloAtual,
} from "../services/dashboardService";
import { calcularAvalPendentesComite } from "../utils/porcentagensAvaliacoes";
import type { User } from "../types/User";
import { CollaboratorsListPage } from "./collaborator-list/CollaboratorsListPage";

interface Ciclo {
  id: number;
  dataFechamentoRevisaoComite: string | null;
}

const DashboardComite = () => {
  const [porcentagem, setPorcentagem] = useState<number>(0);
  const [cicloAtual, setCicloAtual] = useState<Ciclo | null>(null);
  const [numEqualizacoePend, setEqualizacoesPend] = useState<number | null>(0);
  const [comite, setcomite] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const userId = userObj.id ?? null;
      console.log("User object from localStorage:", userObj);
      console.log("User id from localStorage:", userId);

      setcomite(userObj);
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);
  // Buscar ciclo atual
  useEffect(() => {
    buscarCicloAtual()
      .then((ciclo) => {
        setCicloAtual(ciclo);
      })
      .catch((erro) => {
        console.error("Erro ao buscar ciclo atual:", erro);
      });
  }, []);

  //Buscar mentorados e suas avaliacoes
  useEffect(() => {
    Promise.all([buscaAllUsers(), buscarAutoavaliacoes(), buscarAllMentores()])
      .then(([users, autoAvaliacoes, mentores]) => {
        // console.log("Users:", users);
        // console.log("Auto Avaliações:", autoAvaliacoes);
        // console.log("Avaliações 360:", avaliacoes360);
        const numMentores = mentores.length;
        console.log("NUMERPO DE MENTORES", numMentores);
        const usersTam = users.length;

        setEqualizacoesPend(usersTam - numMentores);

        // Calcular porcentagem de avaliações 360 pendentes do avaliador
        const porcentPendentes = calcularAvalPendentesComite(
          users,
          autoAvaliacoes,
          mentores
        );
        setPorcentagem(porcentPendentes);
      })
      .catch((erro) => {
        console.error(erro);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-row p-6">
        <div className="mb-6">
          <span className="text-lg ml-2">
            <strong>Olá</strong>, {comite ? comite.name : "carregando..."}!
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-min">
          {/* StatusCycleCard ocupa as duas colunas no desktop */}
          <div className="col-span-1 md:col-span-2"></div>
        </div>
        {/* Grid de 3 colunas para os cards */}
        <div className="flex flex-col gap-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <CardPrazo
              dataFechamentoRevisaoGestor={
                cicloAtual?.dataFechamentoRevisaoComite
              }
            />
            <CardPreenchimento porcentagemPreenchimento={porcentagem} />
            <CardEqualizacoesPendentes
              numEqualizacoesPend={numEqualizacoePend}
            />
          </div>
          <div>
            {/* <DashboardCollaboratorCard /> */}
            <CollaboratorsListPage />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardComite;
