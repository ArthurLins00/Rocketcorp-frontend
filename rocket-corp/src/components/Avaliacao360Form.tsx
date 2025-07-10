import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";

const colaboradoresDisponiveis = [
  { id: "1", nome: "João Silva", cargo: "Desenvolvedor Back-end" },
  { id: "2", nome: "Maria Oliveira", cargo: "UX Designer" },
  { id: "3", nome: "Carlos Souza", cargo: "Analista de Dados" },
];

type AvaliacaoColaborador = {
  idAvaliador: string;
  idAvaliado: string;
  nota: number;
  pontosFortes: string;
  pontosMelhoria: string;
  nomeProjeto: string;
  periodoMeses: string;
  trabalhariaNovamente: number;
  idCiclo: string;
};

type Avaliacao360FormProps = {
  idAvaliador: string;
  idCiclo: string;
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

export default function Avaliacao360Form({ idAvaliador, idCiclo }: Avaliacao360FormProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao360State>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(Object.keys(getInitialState()));

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  const validatePeriodo = (value: string): string => {
    if (value === '') return '';
    
    const num = parseInt(value);
    if (isNaN(num)) return '';
    
    if (num < 1) return '1';
    if (num > 12) return '12';
    return value;
  };

  const handleSelectColaborador = (id: string) => {
    if (!selecionados.includes(id)) {
      setSelecionados((prev) => [...prev, id]);

      setAvaliacoes((prev) => {
        if (!prev[id]) {
          return {
            ...prev,
            [id]: {
              idAvaliador,
              idAvaliado: id,
              idCiclo,
              nota: 0,
              pontosFortes: "",
              pontosMelhoria: "",
              nomeProjeto: "",
              periodoMeses: "",
              trabalhariaNovamente: 0,
            },
          };
        }
        return prev;
      });
    }
  };

  const handleChange = (
    id: string,
    campo: keyof AvaliacaoColaborador,
    valor: string | number
  ) => {
    if (campo === 'periodoMeses' && typeof valor === 'string') {
      valor = validatePeriodo(valor);
    }
  
    setAvaliacoes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
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
          idAvaliador,
          idAvaliado: id,
          idCiclo,
          nota: 0,
          pontosFortes: "",
          pontosMelhoria: "",
          nomeProjeto: "",
          periodoMeses: "",
          trabalhariaNovamente: 0,
        };

        return (
          <div
            key={id}
            className="relative border rounded-xl p-4 pb-16 space-y-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AvatarInicial nome={colaborador.nome} />
                <div>
                  <p className="font-semibold">{colaborador.nome}</p>
                  <p className="text-sm text-gray-500">{colaborador.cargo}</p>
                </div>
              </div>
              <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                {(dados.nota || 0).toFixed(1)} 
              </span>
            </div>

            <div>
              <label className="block text-sm font-small mb-1 text-gray-500">
                Dê uma avaliação de 1 a 5 ao colaborador
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= dados.nota ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => handleChange(id, "nota", star)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-small text-gray-500">Pontos fortes</label>
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  placeholder="Destaque os pontos positivos do colaborador"
                  value={dados.pontosFortes}
                  onChange={(e) => handleChange(id, "pontosFortes", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-small text-gray-500">Pontos de melhoria</label>
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  placeholder="Destaque os pontos onde o colaborador pode melhorar"
                  value={dados.pontosMelhoria}
                  onChange={(e) => handleChange(id, "pontosMelhoria", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label className="text-sm font-small text-gray-500">Nome do Projeto</label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Projeto trabalhado juntos"
                  value={dados.nomeProjeto}
                  onChange={(e) => handleChange(id, "nomeProjeto", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-small text-gray-500">Período</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="w-full border p-2 rounded"
                  placeholder="Meses trabalhados (1-12)"
                  value={dados.periodoMeses}
                  onChange={(e) => handleChange(id, "periodoMeses", e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      handleChange(id, "periodoMeses", "1");
                    }
                  }}
                />
                {dados.periodoMeses && (parseInt(dados.periodoMeses) < 1 || parseInt(dados.periodoMeses) > 12) && (
                  <p className="text-red-500 text-xs mt-1">Digite um valor entre 1 e 12</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Você ficaria motivado em trabalhar novamente com essa pessoa?
              </label>
              <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const label = [
                    "Discordo totalmente",
                    "Discordo parcialmente",
                    "Indiferente",
                    "Concordo parcialmente",
                    "Concordo totalmente",
                  ][nivel - 1];
                  return (
                    <label key={nivel} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`trabalharia-${id}`}
                        value={nivel}
                        checked={dados.trabalhariaNovamente === nivel}
                        onChange={() =>
                          handleChange(id, "trabalhariaNovamente", nivel)
                        }
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  );
                })}
              </div>
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
export function getAvaliacoesFormatadas(state: Avaliacao360State): AvaliacaoColaborador[] {
  return Object.values(state);
}