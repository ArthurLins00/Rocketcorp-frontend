import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";

const mentoresDisponiveis = [
  { id: "1", nome: "Amanda Souza" },
  { id: "2", nome: "Eduardo Lima" },
  { id: "3", nome: "Fernanda Castro" },
];

type MentoringData = {
  mentorId: string;
  rating: number;
  justificativa: string;
};

const LOCAL_STORAGE_KEY = "mentoring";

const getInitialState = (): MentoringData => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return { mentorId: "", rating: 0, justificativa: "" };
};

export default function MentoringForm() {
  const [dados, setDados] = useState<MentoringData>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dados));
  }, [dados]);

  const mentorSelecionado = mentoresDisponiveis.find((m) => m.id === dados.mentorId);

  const resultadosBusca = mentoresDisponiveis.filter(
    (m) =>
      m.nome.toLowerCase().includes(termoBusca.toLowerCase()) &&
      m.id !== dados.mentorId
  );

  const removerMentor = () => {
    setDados({ mentorId: "", rating: 0, justificativa: "" });
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
                    setDados({ ...dados, mentorId: mentor.id });
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
        <div className="relative border rounded-xl p-4 pb-16 space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AvatarInicial nome={mentorSelecionado.nome} />
              <div>
                <p className="font-semibold">{mentorSelecionado.nome}</p>
                <p className="text-sm text-gray-500">Mentor</p>
              </div>
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
                onClick={() => setDados({ ...dados, rating: star })}
              />
            ))}
          </div>

          <div>
            <label className="block font-medium mb-1">Justificativa</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Descreva sua experiência com seu mentor"
              value={dados.justificativa}
              onChange={(e) => setDados({ ...dados, justificativa: e.target.value })}
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
