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

const data = [
  { name: "2023.1", value: 3.5, fill: "#F2C94C" },
  { name: "2023.2", value: 3.3, fill: "#F2C94C" },
  { name: "2024.1", value: 4.2, fill: "#27B3B7" },
  { name: "2024.5", value: 4.5, fill: "#219653" },
];

export const PerformanceChart = () => (
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
