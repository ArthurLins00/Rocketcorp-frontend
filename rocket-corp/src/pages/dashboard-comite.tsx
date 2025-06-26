import { CardPrazo } from "../components/DashboardCards/CardPrazo";
import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardEqualizacoesPendentes } from "../components/DashboardCards/CardEqualizacoesPendentes";
import { DashboardCollaboratorCard } from "../components/DashboardCards/DashboardCollaboratorCard";

const DashboardComite = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-row p-10">
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
      </main>
    </div>
  );
};

export default DashboardComite;
