import { useState } from "react";

type Trilha = {
  id: string;
  nome: string;
};

type TrilhaFilterBarProps = {
  trilhas: Trilha[];
  onSelectTrilha: (trilhaId: string) => void;
};

export default function TrilhaFilterBar({ trilhas, onSelectTrilha }: TrilhaFilterBarProps) {
  const [termoBusca, setTermoBusca] = useState("");

  const resultadosFiltrados = trilhas.filter((trilha) =>
    trilha.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar trilha..."
        className="w-full border px-4 py-2 rounded text-sm shadow-sm"
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
      />
      {termoBusca && resultadosFiltrados.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 border rounded bg-white shadow z-10">
          {resultadosFiltrados.map((trilha) => (
            <li
              key={trilha.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onSelectTrilha(trilha.id);
                setTermoBusca("");
              }}
            >
              {trilha.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
