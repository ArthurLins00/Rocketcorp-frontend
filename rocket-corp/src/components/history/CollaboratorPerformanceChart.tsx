import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
} from 'recharts';
import type { PerformanceData } from '../../models/history';

interface CollaboratorPerformanceChartProps {
  data: PerformanceData[];
}

const getScoreColor = (score: number) => {
  if (score > 4) return '#219653'; // Green
  if (score > 2.5) return '#F2C94C'; // Yellow
  return '#E74C3C'; // Red
};

export const CollaboratorPerformanceChart: React.FC<CollaboratorPerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-lg font-bold text-gray-800">Desempenho</span>
        </div>
      </div>
      
      <div className="flex-1" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barCategoryGap="20%"
            maxBarSize={60}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="semester" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              domain={[0, 5]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              tickCount={6}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [value.toFixed(1), 'Pontuação']}
              labelFormatter={(label) => `Semestre: ${label}`}
            />
            <Bar
              dataKey="score"
              radius={[4, 4, 0, 0]}
              fill="#219653"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
