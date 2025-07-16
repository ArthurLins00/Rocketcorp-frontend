import { CardNotaAtual } from "../components/DashboardCards/CardNotaAtual";
import { CardPreenchimento } from "../components/DashboardCards/CardPreenchimento";
import { CardRevisoesPendentes } from "../components/DashboardCards/CadRevisoesPendentes";

export const roleCardComponents: Record<string, React.FC[]> = {
  COLABORADOR: [],
  GESTOR: [CardNotaAtual, CardPreenchimento, CardRevisoesPendentes],
  COMITE: [],
  RH: [],
};
