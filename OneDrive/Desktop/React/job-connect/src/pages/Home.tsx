import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import JobList from '../components/JobList';
import { Job, Internship } from '../types';

interface FilterState {
  jobType: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  internshipType: string;
  duration: string;
  minStipend: string;
  maxStipend: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, internships, loading, error, fetchJobs, fetchInternships, searchJobs, searchInternships } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    jobType: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    internshipType: '',
    duration: '',
    minStipend: '',
    maxStipend: ''
  });
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');
  const [searchResults, setSearchResults] = useState<(Job | Internship)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<'keyword' | 'location' | 'type' | 'salary' | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(); // Call handleSearch directly to apply filters and search query
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters, activeTab]); // Depend on all relevant state variables

  const loadData = async () => {
    try {
      await Promise.all([fetchJobs(), fetchInternships()]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      if (activeTab === 'jobs') {
        const results = await searchJobs(searchQuery, filters);
        setSearchResults(results as unknown as (Job | Internship)[]);
      } else {
        const results = await searchInternships(searchQuery, filters);
        setSearchResults(results as unknown as (Job | Internship)[]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTabChange = (tab: 'jobs' | 'internships') => {
    setActiveTab(tab);
    setSearchQuery('');
    setSearchResults([]);
    setFilters({
      jobType: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      internshipType: '',
      duration: '',
      minStipend: '',
      maxStipend: ''
    });
  };

  const displayItems = searchQuery || Object.values(filters).some(filter => filter !== '') ? searchResults : (activeTab === 'jobs' ? jobs : internships);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream {activeTab === 'jobs' ? 'Job' : 'Internship'}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search through thousands of {activeTab === 'jobs' ? 'job' : 'internship'} listings
            </p>
          </div>

          {/* Airbnb-style Search Bar */}
          <div className="max-w-4xl mx-auto mt-8 relative">
            <div className="flex flex-col md:flex-row bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
              {/* Keyword/Title Search */}
              <div 
                className={`flex-1 p-2 rounded-full cursor-pointer hover:bg-gray-100 ${activeFilterSection === 'keyword' ? 'bg-gray-100' : ''}`}
                onClick={() => setActiveFilterSection('keyword')}
              >
                <label className="block text-xs font-bold px-4">{activeTab === 'jobs' ? 'Job Title' : 'Internship Title'}</label>
                <input
                  type="text"
                  placeholder={`Search by title or keyword`}
                  className="w-full border-0 focus:ring-0 text-sm px-4 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l border-gray-200 my-2"></div>

              {/* Location Filter */}
              <div 
                className={`flex-1 p-2 rounded-full cursor-pointer hover:bg-gray-100 ${activeFilterSection === 'location' ? 'bg-gray-100' : ''}`}
                onClick={() => setActiveFilterSection('location')}
              >
                <label className="block text-xs font-bold px-4">Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full border-0 focus:ring-0 text-sm px-4 bg-transparent"
                >
                  <option value="">Any</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  {/* Add more locations as needed */}
                </select>
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l border-gray-200 my-2"></div>

              {/* Type Filter and Search Button */}
              <div className="flex-1 flex items-center pr-2">
                <div 
                  className={`flex-1 p-2 rounded-full cursor-pointer hover:bg-gray-100 ${activeFilterSection === 'type' ? 'bg-gray-100' : ''}`}
                  onClick={() => setActiveFilterSection('type')}
                >
                  <label className="block text-xs font-bold px-4">Type</label>
                  {activeTab === 'jobs' ? (
                    <select
                      name="jobType"
                      value={filters.jobType}
                      onChange={handleFilterChange}
                      className="w-full border-0 focus:ring-0 text-sm px-4 bg-transparent"
                    >
                      <option value="">Any Type</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  ) : (
                    <select
                      name="internshipType"
                      value={filters.internshipType}
                      onChange={handleFilterChange}
                      className="w-full border-0 focus:ring-0 text-sm px-4 bg-transparent"
                    >
                      <option value="">Any Type</option>
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                      <option value="part-time">Part Time</option>
                    </select>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-emerald-500 text-white p-4 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-600 active:bg-emerald-700 transition-colors duration-200 ml-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="ml-2 hidden lg:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Additional filter pop-up (optional, for more complex filters) */}
            {/* You could add a conditional rendering here based on activeFilterSection to show a modal/dropdown for more advanced filters like salary/stipend range */}
            {activeFilterSection === 'salary' && activeTab === 'jobs' && (
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 z-20 w-80">
                <h4 className="font-bold mb-4">Salary Range</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    name="minSalary"
                    placeholder="Min Salary"
                    value={filters.minSalary}
                    onChange={handleFilterChange}
                    className="rounded-md border-gray-300 flex-1 p-2 text-sm"
                  />
                  <input
                    type="number"
                    name="maxSalary"
                    placeholder="Max Salary"
                    value={filters.maxSalary}
                    onChange={handleFilterChange}
                    className="rounded-md border-gray-300 flex-1 p-2 text-sm"
                  />
                </div>
                <button 
                  onClick={() => setActiveFilterSection(null)} 
                  className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {activeFilterSection === 'salary' && activeTab === 'internships' && (
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 z-20 w-80">
                <h4 className="font-bold mb-4">Stipend Range</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    name="minStipend"
                    placeholder="Min Stipend"
                    value={filters.minStipend}
                    onChange={handleFilterChange}
                    className="rounded-md border-gray-300 flex-1 p-2 text-sm"
                  />
                  <input
                    type="number"
                    name="maxStipend"
                    placeholder="Max Stipend"
                    value={filters.maxStipend}
                    onChange={handleFilterChange}
                    className="rounded-md border-gray-300 flex-1 p-2 text-sm"
                  />
                </div>
                <button 
                  onClick={() => setActiveFilterSection(null)} 
                  className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => handleTabChange('jobs')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'jobs'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => handleTabChange('internships')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'internships'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Internships
          </button>
        </div>
        <JobList
          items={displayItems}
          type={activeTab}
          loading={loading || isSearching}
          error={error}
        />
      </div>
    </div>
  );
};

export default Home;