import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: number[];
}

export function LineChart({ data }: LineChartProps) {
  const chartData = data.map((value, index) => ({ name: `Day ${index + 1}`, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}