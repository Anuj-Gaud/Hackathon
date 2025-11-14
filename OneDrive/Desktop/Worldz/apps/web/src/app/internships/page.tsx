'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Dummy data for demonstration
const internships = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Tech Corp',
    location: 'Remote',
    duration: '3 months',
    stipend: '$5k/month',
    description: 'Join our engineering team as an intern...',
    requirements: ['Python', 'JavaScript', 'Currently enrolled in CS program'],
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Innovate Inc',
    location: 'San Francisco, CA',
    duration: '6 months',
    stipend: '$4k/month',
    description: 'Help us grow our marketing efforts...',
    requirements: ['Social Media', 'Content Creation', 'Marketing background'],
  },
  // Add more internships...
];

const locations = ['All Locations', 'Remote', 'San Francisco, CA', 'New York, NY'];
const durations = ['All Durations', '3 months', '6 months', '12 months'];

export default function InternshipsPage() {
  const [filters, setFilters] = useState({
    search: '',
    location: 'All Locations',
    duration: 'All Durations',
  });

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      internship.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = filters.location === 'All Locations' || internship.location === filters.location;
    const matchesDuration = filters.duration === 'All Durations' || internship.duration === filters.duration;

    return matchesSearch && matchesLocation && matchesDuration;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search"
              name="search"
              type="text"
              placeholder="Search internships or companies..."
              value={filters.search}
              onChange={handleFilterChange}
            />

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Internship Listings */}
        <div className="grid grid-cols-1 gap-6">
          {filteredInternships.map((internship) => (
            <div key={internship.id} className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-black">{internship.title}</h3>
                  <p className="text-gray-600 mt-1">{internship.company}</p>
                </div>
                <Button variant="outline">Save</Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {internship.location}
                </span>
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {internship.duration}
                </span>
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {internship.stipend}
                </span>
              </div>

              <p className="mt-4 text-gray-600">{internship.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {internship.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <Button>Apply Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 