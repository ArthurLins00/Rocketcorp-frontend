import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Equalizacao } from "../types/Equalizacao";

interface PerformanceChartProps {
  equalizacoes: Equalizacao[];
}

export const PerformanceChart = ({ equalizacoes }: PerformanceChartProps) => {
  // Gera os dados do gráfico a partir das equalizacoes
  const data = (equalizacoes || []).map((eq, idx) => {
    let fill = "#F2C94C"; // amarelo padrão
    if (eq.notaFinal !== undefined && eq.notaFinal !== null) {
      if (eq.notaFinal < 3) fill = "#EB5757"; // vermelho
      else if (eq.notaFinal >= 4.5) fill = "#219653"; // verde
      else if (eq.notaFinal >= 4) fill = "#27B3B7"; // azul
      else fill = "#F2C94C"; // amarelo
    }
    return {
      name: eq.idCiclo ? `Ciclo ${eq.idCiclo}` : `Ciclo ${idx + 1}`,
      value: eq.notaFinal ?? 0,
      fill,
    };
  });

  return (
    <div className="bg-white rounded-lg border border-[#CECDCD] p-6 w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Desempenho</span>
        <button className="border border-[#CECDCD] rounded px-3 py-1 text-sm text-[#1D1D1D]">
          Filtrar por
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            barSize={24}
            radius={[8, 8, 0, 0]}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
