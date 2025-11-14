import React from 'react';
import { useNavigate } from 'react-router-dom';

// Inline interfaces
interface Location {
  id: string;
  city: string;
  area: string;
}

interface Company {
  id: string;
  name: string;
  logo_url: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: Location;
  job_type: string;
  pay_type: string;
  min_amount: number;
  max_amount: number;
  amount: number;
  pay_rate: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

interface Internship {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: Location;
  internship_type: string;
  stipend_type: string;
  min_amount: number;
  max_amount: number;
  amount: number;
  pay_rate: string;
  requirements: string[];
  responsibilities: string[];
  duration: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

interface JobListProps {
  items: (Job | Internship)[];
  type: 'jobs' | 'internships';
  loading?: boolean;
  error?: string | null;
}

const JobList: React.FC<JobListProps> = ({ items, type, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No {type} found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.company?.name}</p>
            </div>
            {item.company?.logo_url && (
              <img
                src={item.company.logo_url}
                alt={item.company.name}
                className="h-12 w-12 object-contain"
              />
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">💼</span>
              {type === 'jobs' 
                ? (item as Job).job_type 
                : (item as Internship).internship_type}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">📍</span>
              {item.location.city}, {item.location.area}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">💰</span>
              {type === 'jobs' ? (
                (item as Job).pay_type === 'range' ? (
                  `${(item as Job).min_amount} - ${(item as Job).max_amount} ${(item as Job).pay_rate}`
                ) : (
                  `${(item as Job).amount} ${(item as Job).pay_rate}`
                )
              ) : (
                (item as Internship).stipend_type === 'range' ? (
                  `${(item as Internship).min_amount} - ${(item as Internship).max_amount} ${(item as Internship).pay_rate}`
                ) : (
                  `${(item as Internship).amount} ${(item as Internship).pay_rate}`
                )
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate(`/${type}/${item.id}`)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList; 