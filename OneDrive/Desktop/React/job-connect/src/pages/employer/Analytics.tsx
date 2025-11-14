import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

// API Response Interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface JobMetrics {
  id: string;
  title: string;
  views: number;
  applications: number;
  shortlisted: number;
  hired: number;
  conversionRate: number;
  postedDate: string;
  status: 'active' | 'closed' | 'draft';
}

interface CandidateMetrics {
  total: number;
  bySource: { source: string; count: number }[];
  byExperience: { range: string; count: number }[];
  byLocation: { location: string; count: number }[];
  byStatus: { status: string; count: number }[];
  bySkill: { skill: string; count: number }[];
}

interface TimeMetrics {
  date: string;
  views: number;
  applications: number;
  shortlisted: number;
  hired: number;
}

interface AnalyticsData {
  jobMetrics: JobMetrics[];
  candidateMetrics: CandidateMetrics;
  timeMetrics: TimeMetrics[];
  summary: {
    totalViews: number;
    totalApplications: number;
    conversionRate: number;
    averageTimeToHire: number;
    activeJobs: number;
    totalHired: number;
  };
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'jobs' | 'candidates'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data instead of API call
      setAnalyticsData(getMockData());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when time range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Mock data for development
  const getMockData = (): AnalyticsData => ({
    jobMetrics: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        views: 1250,
        applications: 85,
        shortlisted: 12,
        hired: 3,
        conversionRate: 3.5,
        postedDate: '2024-03-01',
        status: 'active'
      },
      {
        id: '2',
        title: 'Product Manager',
        views: 980,
        applications: 45,
        shortlisted: 8,
        hired: 2,
        conversionRate: 4.4,
        postedDate: '2024-03-05',
        status: 'active'
      },
      {
        id: '3',
        title: 'UX Designer',
        views: 750,
        applications: 35,
        shortlisted: 6,
        hired: 1,
        conversionRate: 2.9,
        postedDate: '2024-03-10',
        status: 'active'
      }
    ],
    candidateMetrics: {
      total: 165,
      bySource: [
        { source: 'Job Board', count: 85 },
        { source: 'Referrals', count: 35 },
        { source: 'Direct', count: 25 },
        { source: 'Social Media', count: 20 }
      ],
      byExperience: [
        { range: '0-2 years', count: 45 },
        { range: '3-5 years', count: 65 },
        { range: '6-8 years', count: 35 },
        { range: '8+ years', count: 20 }
      ],
      byLocation: [
        { location: 'Mumbai', count: 45 },
        { location: 'Delhi', count: 35 },
        { location: 'Bangalore', count: 55 },
        { location: 'Other', count: 30 }
      ],
      byStatus: [
        { status: 'Applied', count: 165 },
        { status: 'Shortlisted', count: 26 },
        { status: 'Interviewed', count: 15 },
        { status: 'Hired', count: 6 }
      ],
      bySkill: [
        { skill: 'React', count: 45 },
        { skill: 'Node.js', count: 35 },
        { skill: 'Python', count: 25 },
        { skill: 'Java', count: 20 }
      ]
    },
    timeMetrics: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 20) + 5,
      shortlisted: Math.floor(Math.random() * 10) + 2,
      hired: Math.floor(Math.random() * 3) + 1
    })),
    summary: {
      totalViews: 2980,
      totalApplications: 165,
      conversionRate: 5.5,
      averageTimeToHire: 24,
      activeJobs: 3,
      totalHired: 6
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Job Views</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">2,980</p>
          <p className="mt-2 text-sm text-green-600">↑ 12% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">165</p>
          <p className="mt-2 text-sm text-green-600">↑ 8% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">5.5%</p>
          <p className="mt-2 text-sm text-red-600">↓ 2% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Time to Hire</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">24 days</p>
          <p className="mt-2 text-sm text-green-600">↓ 3 days from last month</p>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Activity Over Time</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '7d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '30d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '90d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              90D
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData?.timeMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#0088FE" name="Views" />
              <Line type="monotone" dataKey="applications" stroke="#00C49F" name="Applications" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Candidate Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Candidate Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.candidateMetrics.bySource}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analyticsData?.candidateMetrics.bySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Experience Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.candidateMetrics.byExperience}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      {/* Job Performance Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Job Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shortlisted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hired
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData?.jobMetrics.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.applications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.shortlisted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.hired}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Views Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Job Views Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.jobMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#0088FE" name="Views" />
              <Bar dataKey="applications" fill="#00C49F" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      {/* Candidate Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Location Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.candidateMetrics.byLocation}
                  dataKey="count"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analyticsData?.candidateMetrics.byLocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Experience Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.candidateMetrics.byExperience}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Application Sources */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Application Sources</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.candidateMetrics.bySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your hiring performance and candidate insights</p>
      </div>

      {/* Metric Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedMetric('overview')}
              className={`${
                selectedMetric === 'overview'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedMetric('jobs')}
              className={`${
                selectedMetric === 'jobs'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Jobs
            </button>
            <button
              onClick={() => setSelectedMetric('candidates')}
              className={`${
                selectedMetric === 'candidates'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Candidates
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {analyticsData && (
        <>
          {selectedMetric === 'overview' && renderOverview()}
          {selectedMetric === 'jobs' && renderJobs()}
          {selectedMetric === 'candidates' && renderCandidates()}
        </>
      )}
    </div>
  );
};

export default Analytics; 