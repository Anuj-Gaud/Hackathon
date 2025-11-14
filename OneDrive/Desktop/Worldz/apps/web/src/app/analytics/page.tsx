'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Dummy data for demonstration
const applicationData = [
  { date: '2024-01-01', applications: 12 },
  { date: '2024-01-08', applications: 19 },
  { date: '2024-01-15', applications: 15 },
  { date: '2024-01-22', applications: 25 },
  { date: '2024-01-29', applications: 22 },
  { date: '2024-02-05', applications: 30 },
  { date: '2024-02-12', applications: 28 },
  { date: '2024-02-19', applications: 35 },
];

const viewData = [
  { date: '2024-01-01', views: 150 },
  { date: '2024-01-08', views: 220 },
  { date: '2024-01-15', views: 180 },
  { date: '2024-01-22', views: 300 },
  { date: '2024-01-29', views: 250 },
  { date: '2024-02-05', views: 400 },
  { date: '2024-02-12', views: 350 },
  { date: '2024-02-19', views: 450 },
];

const jobTypeData = [
  { type: 'Frontend', applications: 45 },
  { type: 'Backend', applications: 35 },
  { type: 'Full Stack', applications: 30 },
  { type: 'DevOps', applications: 20 },
  { type: 'Mobile', applications: 25 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">Analytics</h1>
          <p className="mt-1 text-gray-600">Track your job postings performance</p>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex space-x-2">
            <Button
              variant={timeRange === '30' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('30')}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('90')}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Applications Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: '#000000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">Views Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: '#000000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications by Job Type */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Applications by Job Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 