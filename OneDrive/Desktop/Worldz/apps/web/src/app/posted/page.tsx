'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';

// Dummy data for posted jobs and internships
const postedJobs = [
  { id: '1', title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', type: 'Full-time', salary: '$100k', createdAt: '2023-01-01' },
  { id: '2', title: 'Backend Developer', company: 'Tech Corp', location: 'NYC', type: 'Full-time', salary: '$120k', createdAt: '2023-01-02' },
];

const postedInternships = [
  { id: '1', title: 'Software Intern', company: 'Innovate Inc', location: 'NYC', duration: '3 months', stipend: '$2k/month', createdAt: '2023-01-03' },
  { id: '2', title: 'Marketing Intern', company: 'Innovate Inc', location: 'Remote', duration: '6 months', stipend: '$1.5k/month', createdAt: '2023-01-04' },
];

export default function PostedPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-black mb-6">Posted by You</h1>
        <div className="flex justify-center mb-6">
          <Button
            variant={activeTab === 'jobs' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('jobs')}
            className="mr-2"
          >
            Jobs
          </Button>
          <Button
            variant={activeTab === 'internships' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('internships')}
          >
            Internships
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'jobs' ? (
            postedJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-xl font-semibold text-black">{job.title}</h3>
                <p className="text-gray-600 mt-1">{job.company}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="mr-4">{job.location}</span>
                  <span>{job.type}</span>
                </div>
                <p className="mt-2 text-black font-medium">{job.salary}</p>
                <p className="mt-2 text-sm text-gray-500">Posted on: {job.createdAt}</p>
              </div>
            ))
          ) : (
            postedInternships.map((internship) => (
              <div key={internship.id} className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="text-xl font-semibold text-black">{internship.title}</h3>
                <p className="text-gray-600 mt-1">{internship.company}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="mr-4">{internship.location}</span>
                  <span>{internship.duration}</span>
                </div>
                <p className="mt-2 text-black font-medium">{internship.stipend}</p>
                <p className="mt-2 text-sm text-gray-500">Posted on: {internship.createdAt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 