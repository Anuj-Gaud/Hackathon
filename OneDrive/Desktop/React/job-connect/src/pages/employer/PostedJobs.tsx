import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  type: string;
  salary_range: string;
  requirements: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
    logo_url: string;
  };
  applications?: number;
}

// Sample data for testing
const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    company_id: '1',
    location: 'New York, NY',
    type: 'Full-time',
    salary_range: '$120,000 - $150,000',
    requirements: '5+ years of experience...',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      name: 'Tech Corp',
      logo_url: 'https://example.com/logo.png'
    },
    applications: 5
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Join our product team to help shape the future...',
    company_id: '1',
    location: 'Remote',
    type: 'Full-time',
    salary_range: '$100,000 - $130,000',
    requirements: '3+ years of product management...',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: {
      name: 'Tech Corp',
      logo_url: 'https://example.com/logo.png'
    },
    applications: 3
  }
];

const PostedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const fetchPostedJobs = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID found');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching company data for user:', user.id);
      
      const company = await fetchCompanyData();

      if (!company) {
        console.log('No company found for user');
        // For testing, use sample data
        setJobs(sampleJobs);
        setLoading(false);
        return;
      }

      console.log('Company found:', company);

      // Then fetch jobs for this company
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            logo_url
          ),
          applications (
            count
          )
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        // For testing, use sample data on error
        setJobs(sampleJobs);
        setLoading(false);
        return;
      }

      console.log('Jobs fetched:', data);

      // Transform the data to include application count
      const transformedData = data?.map(job => ({
        ...job,
        applications: job.applications?.[0]?.count || 0
      })) || [];

      setJobs(transformedData);
    } catch (err) {
      console.error('Error in fetchPostedJobs:', err);
      // For testing, use sample data on error
      setJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchCompanyData = async () => {
    try {
      console.log('Fetching company data for user:', user?.id);
      const { data: company, error } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }

      if (!company) {
        console.log('No company found for user');
        return null;
      }

      return company;
    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, [fetchPostedJobs]);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      // Update local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(job => job.status === 'active').length,
    paused: jobs.filter(job => job.status === 'paused').length,
    closed: jobs.filter(job => job.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load posted jobs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">Posted Jobs</h1>
        <Link
          to="/employer/post-job"
          className="bg-[#000000] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1d1d1f] transition-colors duration-200"
        >
          Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-[#1d1d1f]">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Paused Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.paused}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Closed Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-[#1d1d1f]">No jobs found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{job.title}</h3>
                  <p className="text-gray-500">{job.company?.name || 'Company Name'} • {job.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {job.applications || 0} applications
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleStatusChange(job.id, job.status === 'active' ? 'paused' : 'active')}
                    className="text-sm text-gray-600 hover:text-[#1d1d1f]"
                  >
                    {job.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="text-sm text-gray-600 hover:text-[#1d1d1f]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostedJobs; 