import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";

const colaboradoresDisponiveis = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Maria Oliveira" },
  { id: "3", nome: "Carlos Souza" },
];

type AvaliacaoColaborador = {
  rating: number;
  pontosFortes: string;
  pontosMelhoria: string;
};

type Avaliacao360State = {
  [colaboradorId: string]: AvaliacaoColaborador;
};

const LOCAL_STORAGE_KEY = "avaliacao360";

const getInitialState = (): Avaliacao360State => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return {};
};

export default function Avaliacao360Form() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao360State>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(Object.keys(getInitialState()));

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  const handleSelectColaborador = (id: string) => {
    if (!selecionados.includes(id)) {
      setSelecionados((prev) => [...prev, id]);

      setAvaliacoes((prev) => {
        if (!prev[id]) {
          return {
            ...prev,
            [id]: {
              rating: 0,
              pontosFortes: "",
              pontosMelhoria: "",
            },
          };
        }
        return prev;
      });
    }
  };

  const handleRating = (id: string, rating: number) => {
    setAvaliacoes((prev) => {
      const atual = prev[id] || { pontosFortes: "", pontosMelhoria: "", rating: 0 };
      return {
        ...prev,
        [id]: {
          ...atual,
          rating,
        },
      };
    });
  };

  const handleTexto = (
    id: string,
    campo: "pontosFortes" | "pontosMelhoria",
    valor: string
  ) => {
    setAvaliacoes((prev) => {
      const atual = prev[id] || { rating: 0, pontosFortes: "", pontosMelhoria: "" };
      return {
        ...prev,
        [id]: {
          ...atual,
          [campo]: valor,
        },
      };
    });
  };

  const removerColaborador = (id: string) => {
    setSelecionados((prev) => prev.filter((selId) => selId !== id));
    setAvaliacoes((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
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
        const dados = avaliacoes[id] || {
          rating: 0,
          pontosFortes: "",
          pontosMelhoria: "",
        };

        return (
          <div
            key={id}
            className="relative border rounded-xl p-4 pb-16 space-y-3 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AvatarInicial nome={colaborador.nome} />
                <p className="font-semibold">{colaborador.nome}</p>
              </div>
              <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                {dados.rating.toFixed(1)}
              </span>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= dados.rating ? "#facc15" : "none"}
                  stroke="#facc15"
                  className="cursor-pointer"
                  onClick={() => handleRating(id, star)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium mb-1">Pontos fortes</p>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Justifique sua nota"
                  value={dados.pontosFortes}
                  onChange={(e) =>
                    handleTexto(id, "pontosFortes", e.target.value)
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Pontos de melhoria</p>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Justifique sua nota"
                  value={dados.pontosMelhoria}
                  onChange={(e) =>
                    handleTexto(id, "pontosMelhoria", e.target.value)
                  }
                />
              </div>
            </div>

            <button
              onClick={() => removerColaborador(id)}
              className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
              aria-label={`Remover avaliação de ${colaborador.nome}`}
            >
              <Trash size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
