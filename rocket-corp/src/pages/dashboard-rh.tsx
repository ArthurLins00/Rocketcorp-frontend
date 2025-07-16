import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardAvaliacoesPendentes } from "../components/DashboardCards/CardAvaliacoesPendentes";
import { CardFechamentoDeCiclo } from "../components/DashboardCards/CardFechamentoDeCiclo";
import { DashboardSmallerCollaboratorCard } from "../components/DashboardCards/DashboardSmallerCollaboratorCard";
import { PreenchimentoChart } from "../components/PreenchimentoChart";

const DashboardRH = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-row p-6">
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
            <CardPreenchimento />
            <CardAvaliacoesPendentes />
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
