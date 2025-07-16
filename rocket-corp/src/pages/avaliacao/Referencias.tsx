import { useEffect, useState } from "react";
import ReferenciasForm from "../../components/ReferenciasForm";
import { buscarCicloAberto } from "../../services/cicleService";
import { getUsuarioLogado } from '../../utils/auth';

export default function ReferenciasPage() {
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
    <div className="p-4">
      <ReferenciasForm idCiclo={idCiclo} idAvaliador={idAvaliador} />
    </div>
  );
}