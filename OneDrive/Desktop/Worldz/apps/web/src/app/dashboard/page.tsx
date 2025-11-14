'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';

// Dummy data for demonstration
const stats = {
  totalApplications: 156,
  activeJobs: 12,
  activeInternships: 8,
  viewsLast30Days: 1234,
};

const recentActivity = [
  {
    id: 1,
    type: 'application',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    applicant: 'John Doe',
    date: '2024-02-20',
  },
  {
    id: 2,
    type: 'view',
    title: 'Product Manager',
    company: 'Innovate Inc',
    views: 45,
    date: '2024-02-19',
  },
  // Add more activity...
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's an overview of your activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="mt-2 text-3xl font-bold text-black">{stats.totalApplications}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
            <p className="mt-2 text-3xl font-bold text-black">{stats.activeJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Internships</h3>
            <p className="mt-2 text-3xl font-bold text-black">{stats.activeInternships}</p>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-sm font-medium text-gray-500">Views (Last 30 Days)</h3>
            <p className="mt-2 text-3xl font-bold text-black">{stats.viewsLast30Days}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-soft p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
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

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === 'application'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {activity.type === 'application' ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-black">
                      {activity.title} at {activity.company}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {activity.type === 'application'
                        ? `New application from ${activity.applicant}`
                        : `${activity.views} views`}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 