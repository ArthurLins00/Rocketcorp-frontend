import { useState, useEffect } from "react";
import type { Equalizacao } from "../../types/Equalizacao";
import EqualizacaoCard from "../../components/equalizacao/EqualizacaoCard";
import { getEqualizacoes } from "../utils/equalizacaoService";

export default function EqualizacoesPage() {
  const [busca, setBusca] = useState("");
  const [equalizacoes, setEqualizacoes] = useState<Equalizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log("[DEBUG] EqualizacoesPage: Component rendered", {
  //   loading,
  //   error,
  //   equalizacoes,
  // });

  useEffect(() => {
    // console.log("[DEBUG] EqualizacoesPage: useEffect triggered");
    const fetchData = async () => {
      try {
        // console.log("[DEBUG] EqualizacoesPage: Starting to fetch data");
        setLoading(true);
        setError(null);
        const data = await getEqualizacoes();
        // console.log("[DEBUG] EqualizacoesPage: Data received:", data);
        setEqualizacoes(data);
      } catch (err) {
        // console.error("[DEBUG] EqualizacoesPage: Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        // console.log("[DEBUG] EqualizacoesPage: Setting loading to false");
        setLoading(false);
      }
    };

    fetchData();
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

  // console.log("[DEBUG] EqualizacoesPage: Render state", {
  //   loading,
  //   error,
  //   equalizacoesLength: equalizacoes.length,
  //   filteredLength: equalizacoesFiltradas.length,
  // });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#08605F]">Equalizações</h1>

      <input
        type="text"
        placeholder="Buscar colaborador..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      {loading && (
        <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-gray-600">Carregando equalizações...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Erro: {error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Verifique o console para mais detalhes
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {equalizacoesFiltradas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-600">
                {equalizacoes.length === 0
                  ? "Nenhuma equalização encontrada"
                  : "Nenhuma equalização corresponde à busca"}
              </p>
            </div>
          ) : (
            <>
              {equalizacoesFiltradas.map((equalizacao) => (
                <EqualizacaoCard
                  key={equalizacao.idEqualizacao}
                  equalizacao={equalizacao}
                  onUpdate={handleAtualizarEqualizacao}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
