import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";

const mentoresDisponiveis = [
  { id: "1", nome: "Amanda Souza" },
  { id: "2", nome: "Eduardo Lima" },
  { id: "3", nome: "Fernanda Castro" },
];

type MentoringData = {
  idAvaliador: string;
  idAvaliado: string; // mentor selecionado
  idCiclo: string;
  nota: number;
  justificativa: string;
};

type MentoringFormProps = {
  idAvaliador: string;
  idCiclo: string;
};

const LOCAL_STORAGE_KEY = "mentoring";

const getInitialState = (idAvaliador: string, idCiclo: string): MentoringData => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return { idAvaliador, idAvaliado: "", idCiclo, nota: 0, justificativa: "" };
};

export default function MentoringForm({ idAvaliador, idCiclo }: MentoringFormProps) {
  const [dados, setDados] = useState<MentoringData>(() =>
    getInitialState(idAvaliador || "", idCiclo || "")
  );
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dados));
  }, [dados]);

  const mentorSelecionado = mentoresDisponiveis.find((m) => m.id === dados.idAvaliado);

  const resultadosBusca = mentoresDisponiveis.filter(
    (m) =>
      m.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
      m.id !== dados.idAvaliado
  );

  const removerMentor = () => {
    setDados({
      idAvaliador,
      idAvaliado: "",
      idCiclo,
      nota: 0,
      justificativa: "",
    });
  };

  return (
    <div className="space-y-6">
      {!mentorSelecionado && (
        <div>
          <input
            type="text"
            placeholder="Buscar seu mentor"
            className="w-full border p-2 rounded"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          {termoBusca && resultadosBusca.length > 0 && (
            <ul className="border rounded mt-1 bg-white shadow">
              {resultadosBusca.map((mentor) => (
                <li
                  key={mentor.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDados((prev) => ({
                      ...prev,
                      idAvaliado: mentor.id,
                      idAvaliador,
                      idCiclo,
                    }));
                    setTermoBusca("");
                  }}
                >
                  {mentor.nome}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mentorSelecionado && (
        <div className="relative border rounded-xl p-4 pb-16 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AvatarInicial nome={mentorSelecionado.nome} />
              <div>
                <p className="font-semibold">{mentorSelecionado.nome}</p>
                <p className="text-sm text-gray-500">Mentor</p>
              </div>
            </div>
            <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
              {(dados.nota ?? 0).toFixed(1)}
            </span>
          </div>
          <label className="block font-small mb-1 text-sm text-gray-500">
            Dê uma avaliação de 1 a 5 para seu mentor
          </label>
          <div className="flex gap-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                fill={star <= dados.nota ? "#facc15" : "none"}
                stroke="#facc15"
                className="cursor-pointer"
                onClick={() => setDados((prev) => ({ ...prev, nota: star }))}
              />
            ))}
          </div>

          <div>
            <label className="block font-small mb-1 text-sm text-gray-500">
              Justifique sua avaliação
            </label>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="Descreva sua experiência com seu mentor"
              value={dados.justificativa}
              onChange={(e) =>
                setDados((prev) => ({ ...prev, justificativa: e.target.value }))
              }
            />
          </div>

          <button
            onClick={removerMentor}
            className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
            aria-label="Remover mentor selecionado"
          >
            <Trash size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

// Função para formatar os dados para envio ao backend
export function getMentoringFormatado(dados: MentoringData): MentoringData {
  return dados;
}
