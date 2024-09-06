// components/BalanceChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BalanceChartProps {
  data: Array<{ date: number; balance: number }>;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => (
  <div className="chart-container">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value) => [`${Number(value).toFixed(4)} SOL`, 'Balance']}
        />
        <Line type="monotone" dataKey="balance" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default BalanceChart;
