import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";

const colaboradoresDisponiveis = [
  { id: "1", nome: "João Silva", cargo: "Desenvolvedor Back-end" },
  { id: "2", nome: "Maria Oliveira", cargo: "UX Designer" },
  { id: "3", nome: "Carlos Souza", cargo: "Analista de Dados" },
];

type Referencia = {
  idAvaliado: string;
  idAvaliador: string;
  justificativa: string;
  idCiclo: string;
};

type ReferenciasFormProps = {
  idAvaliador: string;
  idCiclo: string;
};

type ReferenciasState = {
  [colaboradorId: string]: Referencia;
};

const LOCAL_STORAGE_KEY = "referencias";

const getInitialState = (): ReferenciasState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return {};
};

export default function ReferenciasForm({ idAvaliador, idCiclo }: ReferenciasFormProps) {
  const [referencias, setReferencias] = useState<ReferenciasState>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(Object.keys(getInitialState()));

  // Corrige registros incompletos do localStorage
  useEffect(() => {
    const atualizadas: ReferenciasState = {};

    Object.entries(referencias).forEach(([id, ref]) => {
      atualizadas[id] = {
        ...ref,
        idAvaliado: id,
        idAvaliador,
        idCiclo,
      };
    });

    setReferencias(atualizadas);
  }, [idAvaliador, idCiclo]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(referencias));
  }, [referencias]);

  const handleSelectColaborador = (id: string) => {
    if (!selecionados.includes(id)) {
      setSelecionados((prev) => [...prev, id]);
    }
  };

  const handleJustificativa = (id: string, texto: string) => {
    setReferencias((prev) => ({
      ...prev,
      [id]: {
        idAvaliado: id,
        idAvaliador,
        idCiclo,
        justificativa: texto,
      },
    }));
  };

  const removerColaborador = (id: string) => {
    setSelecionados((prev) => prev.filter((cid) => cid !== id));

    setReferencias((prev) => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
  };

  const resultadosBusca = colaboradoresDisponiveis.filter(
    (c) =>
      c.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
      !selecionados.includes(c.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="Buscar colaborador"
          className="w-full border p-2 rounded"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        {termoBusca && resultadosBusca.length > 0 && (
          <ul className="border rounded mt-1 bg-white shadow">
            {resultadosBusca.map((colab) => (
              <li
                key={colab.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleSelectColaborador(colab.id);
                  setTermoBusca("");
                }}
              >
                {colab.nome}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selecionados.map((id) => {
        const colaborador = colaboradoresDisponiveis.find((c) => c.id === id);
        if (!colaborador) return null;

        const dados = referencias[id] || {
          idAvaliado: id,
          idAvaliador,
          idCiclo,
          justificativa: "",
        };

        return (
          <div key={id} className="border rounded-xl p-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AvatarInicial nome={colaborador.nome} />
                <div>
                  <p className="font-semibold">{colaborador.nome}</p>
                  <p className="text-sm text-gray-500">{colaborador.cargo}</p>
                </div>
              </div>
              <button
                onClick={() => removerColaborador(id)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remover ${colaborador.nome}`}
              >
                <Trash size={20} />
              </button>
            </div>

            <div>
              <label className="block font-small mb-1 text-sm text-gray-500">
                Justifique sua escolha
              </label>
              <textarea
                className="w-full p-2 border rounded resize-none"
                placeholder="Por que essa pessoa é uma referência?"
                value={dados.justificativa}
                onChange={(e) => handleJustificativa(id, e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Para envio ao backend
export function getReferenciasFormatadas(referencias: ReferenciasState): Referencia[] {
  return Object.values(referencias);
}
