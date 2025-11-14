import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  type: 'jobs' | 'internships';
  filters: {
    jobType?: string;
    location?: string;
    minSalary?: string;
    maxSalary?: string;
    internshipType?: string;
    duration?: string;
    minStipend?: string;
    maxStipend?: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ type, filters, onFilterChange }) => {
  const jobTypeOptions: FilterOption[] = [
    { value: '', label: 'Job Type' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' }
  ];

  const locationOptions: FilterOption[] = [
    { value: '', label: 'Location' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' }
  ];

  const internshipTypeOptions: FilterOption[] = [
    { value: '', label: 'Internship Type' },
    { value: 'summer', label: 'Summer' },
    { value: 'winter', label: 'Winter' },
    { value: 'part-time', label: 'Part Time' }
  ];

  const durationOptions: FilterOption[] = [
    { value: '', label: 'Duration' },
    { value: '1 month', label: '1 Month' },
    { value: '2 months', label: '2 Months' },
    { value: '3 months', label: '3 Months' },
    { value: '6 months', label: '6 Months' }
  ];

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {type === 'jobs' ? (
        <>
          <select
            name="jobType"
            value={filters.jobType || ''}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
            className="rounded-md border-gray-300"
          >
            {jobTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="location"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="rounded-md border-gray-300"
          >
            {locationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              name="minSalary"
              placeholder="Min Salary"
              value={filters.minSalary || ''}
              onChange={(e) => onFilterChange('minSalary', e.target.value)}
              className="rounded-md border-gray-300 flex-1"
            />
            <input
              type="number"
              name="maxSalary"
              placeholder="Max Salary"
              value={filters.maxSalary || ''}
              onChange={(e) => onFilterChange('maxSalary', e.target.value)}
              className="rounded-md border-gray-300 flex-1"
            />
          </div>
        </>
      ) : (
        <>
          <select
            name="internshipType"
            value={filters.internshipType || ''}
            onChange={(e) => onFilterChange('internshipType', e.target.value)}
            className="rounded-md border-gray-300"
          >
            {internshipTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="duration"
            value={filters.duration || ''}
            onChange={(e) => onFilterChange('duration', e.target.value)}
            className="rounded-md border-gray-300"
          >
            {durationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              name="minStipend"
              placeholder="Min Stipend"
              value={filters.minStipend || ''}
              onChange={(e) => onFilterChange('minStipend', e.target.value)}
              className="rounded-md border-gray-300 flex-1"
            />
            <input
              type="number"
              name="maxStipend"
              placeholder="Max Stipend"
              value={filters.maxStipend || ''}
              onChange={(e) => onFilterChange('maxStipend', e.target.value)}
              className="rounded-md border-gray-300 flex-1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar; 