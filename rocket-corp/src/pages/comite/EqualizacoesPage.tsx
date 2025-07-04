import { useState, useEffect } from "react";
import type { Equalizacao } from "../../types/Equalizacao";
import EqualizacaoCard from "../../components/equalizacao/EqualizacaoCard";
import { getEqualizacoes } from "../utils/equalizacaoService";

export default function EqualizacoesPage() {
  const [busca, setBusca] = useState("");
  const [equalizacoes, setEqualizacoes] = useState<Equalizacao[]>([]);

  useEffect(() => {
    const data = getEqualizacoes();
    setEqualizacoes(data);
  }, []);

  const handleAtualizarEqualizacao = (atualizada: Equalizacao) => {
    setEqualizacoes((prev) =>
      prev.map((eq) =>
        eq.idEqualizacao === atualizada.idEqualizacao ? atualizada : eq
      )
    );
  };

  const equalizacoesFiltradas = equalizacoes.filter((eq) =>
    eq.nomeAvaliado.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">

      <input
        type="text"
        placeholder="Buscar colaborador..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="space-y-4">
        {equalizacoesFiltradas.map((equalizacao) => (
          <EqualizacaoCard
            key={equalizacao.idEqualizacao}
            equalizacao={equalizacao}
            onUpdate={handleAtualizarEqualizacao}
          />
        ))}
      </div>
    </div>
  );
}
