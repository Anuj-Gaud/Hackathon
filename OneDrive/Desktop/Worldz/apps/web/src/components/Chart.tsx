import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Example data
const lineData = [
  { name: 'Jan', applications: 10 },
  { name: 'Feb', applications: 15 },
  { name: 'Mar', applications: 20 },
  { name: 'Apr', applications: 25 },
  { name: 'May', applications: 30 },
];

const barData = [
  { name: 'Frontend', applications: 40 },
  { name: 'Backend', applications: 30 },
  { name: 'Full Stack', applications: 20 },
  { name: 'DevOps', applications: 10 },
];

interface ChartProps {
  type: 'line' | 'bar';
  title: string;
  data?: any[];
}

export default function Chart({ type, title, data = type === 'line' ? lineData : barData }: ChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <h3 className="text-xl font-semibold text-black mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#000" />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#000" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
} 