import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../contexts/JobsContext';

const Internships: React.FC = () => {
  const { internships, loading, error, fetchInternships } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchInternships();
      } catch (err) {
        console.error('Error loading internships:', err);
      }
    };
    loadData();
  }, [fetchInternships]);

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || internship.internship_type === selectedType;
    const matchesLocation = selectedLocation === 'all' || 
                          internship.location.city.toLowerCase() === selectedLocation.toLowerCase();
    const matchesDuration = selectedDuration === 'all' || internship.duration === selectedDuration;

    return matchesSearch && matchesType && matchesLocation && matchesDuration;
  });

  const uniqueLocations = Array.from(new Set(internships.map(internship => internship.location.city)));
  const uniqueTypes = Array.from(new Set(internships.map(internship => internship.internship_type)));
  const uniqueDurations = Array.from(new Set(internships.map(internship => internship.duration)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading internships...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search internships..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                <option value="all">All Durations</option>
                {uniqueDurations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Internships List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <Link
                key={internship.id}
                to={`/internships/${internship.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{internship.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{internship.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {internship.internship_type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {internship.location.city}, {internship.location.area}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {internship.stipend_type === 'range' ? (
                        `${internship.min_amount} - ${internship.max_amount} ${internship.pay_rate}`
                      ) : (
                        `${internship.amount} ${internship.pay_rate}`
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Duration: {internship.duration}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No internships found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships; 