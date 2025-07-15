import { useEffect, useState } from "react";
import MentoringForm from "../../components/MentoringForm";
import { buscarCicloAberto } from "../../services/cicleService";
import { getUsuarioLogado } from '../../utils/auth';

export default function Mentoring() {
  const usuario = getUsuarioLogado();
  const idAvaliador = usuario?.id?.toString() ?? "";
  const [idCiclo, setIdCiclo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCiclo() {
      const cicloAberto = await buscarCicloAberto();
      setIdCiclo(cicloAberto?.id?.toString() ?? null);
    }
    fetchCiclo();
  }, []);

  if (!idCiclo) {
    return <div>Carregando ciclo...</div>;
  }

  return (
    <main className="p-6">
      <MentoringForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </main>
  );
}
