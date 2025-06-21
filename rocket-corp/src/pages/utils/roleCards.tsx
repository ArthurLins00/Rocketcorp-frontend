import { CardNotaAtual } from "../../components/cards/CardNotaAtual";
import { CardPreenchimento } from "../../components/cards/CardPreenchimento";
import { CardRevisoesPendentes } from "../../components/cards/CadRevisoesPendentes";

export const roleCardComponents: Record<string, React.FC[]> = {
  COLABORADOR: [],
  GESTOR: [CardNotaAtual, CardPreenchimento, CardRevisoesPendentes],
  COMITE: [],
  RH: [],
};
