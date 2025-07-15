import { useEffect, useState } from "react";
import AutoavaliacaoForm from '../../components/AutoavaliacaoForm';
import { buscarCicloAberto } from '../../services/cicleService';
import { getUsuarioLogado } from '../../utils/auth';

export default function Autoavaliacao() {
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
      <AutoavaliacaoForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </main>
  );
}