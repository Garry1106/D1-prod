// components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  change: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly'; // Added 'Monthly'
  color?: string; // Added color as an optional prop
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, frequency, color }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full h-36">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-gray-500">{frequency}</span>
      </div>
      <div className={`text-3xl font-semibold ${color || 'text-gray-800'}`}>{value}</div>
      <div className={`text-sm ${parseInt(change) > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </div>
    </div>
  );
};

export default MetricCard;
