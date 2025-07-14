import { useState } from "react";
import type { Equalizacao } from "../../types/Equalizacao";
import { ChevronDown, ChevronUp, Download, Pencil, Save } from "lucide-react";
import ResumoIA from "../GenAIComponent";
import AvatarInicial from "../AvatarInicial";
import {
  salvarEqualizacaoAtualizada,
  enviarEqualizacaoParaBackend,
} from "../../pages/utils/equalizacaoService";

type Props = {
  equalizacao: Equalizacao;
  onUpdate: (atualizada: Equalizacao) => void;
};

export default function EqualizacaoCard({ equalizacao, onUpdate }: Props) {
  const [expandido, setExpandido] = useState(false);
  const [notaFinal, setNotaFinal] = useState<number | null>(
    equalizacao.notaFinal ?? null
  );
  const [justificativa, setJustificativa] = useState(
    equalizacao.justificativa || ""
  );
  const [editando, setEditando] = useState(equalizacao.status === "Pendente");
  const [statusLocal, setStatusLocal] = useState(equalizacao.status);

  const {
    nomeAvaliado,
    cargoAvaliado,
    notaAutoavaliacao,
    notaGestor,
    notaAvaliacao360,
    resumoIA,
  } = equalizacao;

  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números entre 0 e 5 com 1 casa decimal
    if (
      value === "" ||
      (/^[0-5](\.\d?)?$/.test(value) && parseFloat(value) <= 5)
    ) {
      setNotaFinal(value ? Number(value) : null);
    }
  };

  function calcularMedia(notas: (number | null)[]) {
    const validNotas = notas.filter((nota): nota is number => nota !== null);
    if (validNotas.length === 0) return 0;
    return parseFloat(
      (validNotas.reduce((a, b) => a + b, 0) / validNotas.length).toFixed(1)
    );
  }

  function calcularDesvio(nota: number | null, media: number) {
    if (nota === null) return 0;
    return Math.abs(nota - media);
  }

  function getCorPorNota(nota: number | null) {
    if (nota === null) return { barra: "bg-gray-200", texto: "text-gray-600" };
    const percentual = (nota / 5) * 100;

    if (percentual < 20) return { barra: "bg-red-600", texto: "text-red-600" };
    if (percentual < 40)
      return { barra: "bg-orange-500", texto: "text-orange-500" };
    if (percentual < 60)
      return { barra: "bg-yellow-500", texto: "text-yellow-500" };
    if (percentual < 80)
      return { barra: "bg-lime-500", texto: "text-lime-500" };
    return { barra: "bg-green-700", texto: "text-green-700" };
  }

  function getCorPorDivergencia(desvio: number) {
    if (desvio <= 0.5) return { barra: "bg-gray-300", texto: "text-gray-600" };
    if (desvio <= 1.0)
      return { barra: "bg-yellow-400", texto: "text-yellow-600" };
    if (desvio <= 1.5)
      return { barra: "bg-orange-500", texto: "text-orange-600" };
    return { barra: "bg-red-600", texto: "text-red-600" };
  }

  const media = calcularMedia([
    notaAutoavaliacao,
    notaGestor,
    notaAvaliacao360,
  ]);
  const desvios = [
    calcularDesvio(notaAutoavaliacao, media),
    calcularDesvio(notaGestor, media),
    calcularDesvio(notaAvaliacao360, media),
  ];
  const maxDesvio = Math.max(...desvios);
  const temDivergencia = maxDesvio > 0.8;

  const renderBarra = (nota: number, index: number) => {
    const largura = `${(nota / 5) * 100}%`;
    let cor;

    if (temDivergencia) {
      cor =
        desvios[index] === maxDesvio
          ? getCorPorDivergencia(desvios[index])
          : { barra: "bg-gray-300", texto: "text-gray-600" };
    } else {
      cor = getCorPorNota(nota);
    }

    return (
      <div className="w-full bg-gray-200 h-3 rounded-md">
        <div
          className={`h-3 ${cor.barra} rounded-md`}
          style={{ width: largura }}
        />
      </div>
    );
  };

  const handleSalvar = async () => {
    const notaFinalizada =
      notaFinal ??
      calcularMedia([notaAutoavaliacao, notaGestor, notaAvaliacao360]);

    // Ensure nota final is positive (minimum 0.1 if calculated as 0)
    const notaFinalValidada = notaFinalizada > 0 ? notaFinalizada : 0.1;
    const justificativaFinal = justificativa.trim() || "Equalização finalizada";

    const atualizada: Equalizacao = {
      ...equalizacao,
      notaFinal: notaFinalValidada,
      justificativa: justificativaFinal,
      status: "Finalizado",
    };

    try {
      // If this is an existing equalização (has valid ID), update it
      if (
        atualizada.idEqualizacao &&
        !isNaN(parseInt(atualizada.idEqualizacao))
      ) {
        await salvarEqualizacaoAtualizada(atualizada);
        console.log("Equalização atualizada no backend");
      } else {
        // If it's a new equalização (no valid ID), create it
        const result = await enviarEqualizacaoParaBackend(atualizada);

        // Update the equalização with the returned ID if available
        if (result.success && result.id) {
          atualizada.idEqualizacao = result.id.toString();
          console.log("Updated equalizacao with backend ID:", result.id);
        }
      }

      onUpdate(atualizada);
      setEditando(false);
      setStatusLocal("Finalizado");
    } catch (error) {
      console.error("Erro ao salvar equalização:", error);
      // Handle error (maybe show a toast or error message)
    }
  };

  const handleEditar = async () => {
    // Ensure we have valid values for required fields
    const notaFinalizada =
      notaFinal ??
      calcularMedia([notaAutoavaliacao, notaGestor, notaAvaliacao360]);
    // Ensure nota final is positive (minimum 0.1 if calculated as 0)
    const notaFinalValidada = notaFinalizada > 0 ? notaFinalizada : 0.1;
    const justificativaFinal =
      justificativa.trim() || "Equalização sendo editada";

    const atualizada: Equalizacao = {
      ...equalizacao,
      notaFinal: notaFinalValidada,
      justificativa: justificativaFinal,
      status: "Pendente",
    };

    try {
      // If this is an existing equalização (has valid ID), update it
      if (
        atualizada.idEqualizacao &&
        !isNaN(parseInt(atualizada.idEqualizacao))
      ) {
        await salvarEqualizacaoAtualizada(atualizada);
        console.log("Equalização atualizada no backend");
      } else {
        // If it's a new equalização (no valid ID), create it
        const result = await enviarEqualizacaoParaBackend(atualizada);

        // Update the equalização with the returned ID if available
        if (result.success && result.id) {
          atualizada.idEqualizacao = result.id.toString();
          console.log("Updated equalizacao with backend ID:", result.id);
        }
      }

      setEditando(true);
      setStatusLocal("Pendente");
      onUpdate(atualizada);
    } catch (error) {
      console.error("Erro ao editar equalização:", error);
      // Handle error (maybe show a toast or error message)
    }
  };

  return (
    <div className="border rounded-xl shadow-md p-4 bg-white">
      {/* Cabeçalho */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpandido(!expandido)}
      >
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AvatarInicial nome={nomeAvaliado} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{nomeAvaliado}</span>
              <p className="text-xs text-gray-600">{cargoAvaliado}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                statusLocal === "Finalizado"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {statusLocal}
            </span>
          </h2>
        </div>

        {/* Notas */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span>
            Autoavaliação{" "}
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {notaAutoavaliacao?.toFixed(1) ?? "N/A"}
            </span>
          </span>
          <span>
            Avaliação 360{" "}
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {notaAvaliacao360?.toFixed(1) ?? "N/A"}
            </span>
          </span>
          <span>
            Nota gestor{" "}
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {notaGestor?.toFixed(1) ?? "N/A"}
            </span>
          </span>
          <span>
            Nota final{" "}
            <span
              className={`px-2 py-1 rounded font-bold ${
                statusLocal === "Finalizado"
                  ? "bg-[#08605F] text-white"
                  : "bg-gray-200"
              }`}
            >
              {statusLocal === "Finalizado"
                ? (
                    notaFinal ??
                    calcularMedia([
                      notaAutoavaliacao,
                      notaGestor,
                      notaAvaliacao360,
                    ])
                  ).toFixed(1)
                : "-"}
            </span>
          </span>
          {expandido ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Conteúdo expandido */}
      {expandido && (
        <div className="mt-6 space-y-4">
          {/* Gráficos de barra */}
          <div className="flex justify-between gap-4">
            {[
              { nome: "Autoavaliação", nota: notaAutoavaliacao, index: 0 },
              { nome: "Nota gestor", nota: notaGestor, index: 1 },
              { nome: "Avaliação 360", nota: notaAvaliacao360, index: 2 },
            ].map((item) => {
              const cor = temDivergencia
                ? desvios[item.index] === maxDesvio
                  ? getCorPorDivergencia(desvios[item.index])
                  : { texto: "text-gray-600" }
                : getCorPorNota(item.nota);

              return (
                <div key={item.nome} className="w-1/3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-600">{item.nome}</p>
                    <span className={`text-sm font-bold ${cor.texto}`}>
                      {item.nota?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                  {renderBarra(
                    Number(item.nota?.toFixed(1) ?? "0"),
                    item.index
                  )}
                </div>
              );
            })}
          </div>

          <ResumoIA titulo="Resumo IA" descricao={resumoIA} />

          {/* Nota final editável */}
          <div className="space-y-2">
            <span className="text-sm font-semibold mr-1">
              Nota Final (Comitê):
            </span>
            {editando ? (
              <div>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={notaFinal ?? ""}
                  onChange={handleNotaChange}
                  className={`w-20 px-2 py-1 border rounded-md ${
                    notaFinal && notaFinal > 5 ? "border-red-500" : ""
                  }`}
                  placeholder={calcularMedia([
                    notaAutoavaliacao,
                    notaGestor,
                    notaAvaliacao360,
                  ]).toFixed(1)}
                />
                {notaFinal && notaFinal > 5 && (
                  <p className="text-red-500 text-xs mt-1">
                    A nota máxima é 5.0
                  </p>
                )}
              </div>
            ) : (
              <p
                className={`text-lg font-bold ${
                  statusLocal === "Finalizado"
                    ? "text-[#08605F]"
                    : "text-gray-400"
                }`}
              >
                {statusLocal === "Finalizado"
                  ? (
                      notaFinal ??
                      calcularMedia([
                        notaAutoavaliacao,
                        notaGestor,
                        notaAvaliacao360,
                      ])
                    ).toFixed(1)
                  : "-"}
              </p>
            )}
          </div>

          {/* Justificativa */}
          <div className="space-y-1">
            <span className="font-semibold text-sm">Justificativa:</span>
            {editando ? (
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Descreva a justificativa para a nota"
              />
            ) : (
              <p className="text-sm text-gray-700">
                {justificativa || "Sem justificativa registrada"}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-2">
            {editando ? (
              <button
                onClick={handleSalvar}
                className="flex items-center gap-1 px-4 py-2 bg-[#08605F] text-white rounded-md font-medium"
              >
                <Save size={16} /> Concluir
              </button>
            ) : (
              <>
                <button className="flex items-center gap-1 px-4 py-2 border border-[#08605F] text-[#08605F] rounded-md font-medium">
                  <Download size={16} /> Exportar
                </button>
                <button
                  onClick={handleEditar}
                  className="flex items-center gap-1 px-4 py-2 border border-[#08605F] text-[#08605F] rounded-md font-medium"
                >
                  <Pencil size={16} /> Editar resultado
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
